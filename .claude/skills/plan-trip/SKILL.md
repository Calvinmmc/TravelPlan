---
name: plan-trip
description: 为任意旅行目的地做网络调研（景点、交通、住宿、购物、餐厅、消费价格），并排出可导入旅行规划 app 的逐日行程。用户说「帮我规划去 X 的行程」「调研一下 X」「/plan-trip X」时使用。
argument-hint: <目的地> [天数或日期] [出发城市] [偏好…]
---

# /plan-trip：目的地调研 + 行程生成

流水线：3 个调研 agent 并行检索 → 脚本合并、校验 → 规划 agent 排行程 → 生成可导入 app 的 `trip.json`。

产物放在 `research/<slug>/`：

| 文件 | 内容 |
|---|---|
| `sights.json` / `stay-shop.json` / `food-cost.json` | 各调研 agent 的原始结果 |
| `research.json` | 合并后的完整调研数据（格式：`src/types/research.ts`） |
| `README.md` | 按类别排好的一览表，带来源链接，给人看的 |
| `trip.json` | 逐日行程，在 app 左下角「导入」即可使用 |

## 1. 确认出行参数

### 先读个人配置

读项目根目录的 `travel.config.json`，里面是使用者的默认值。字段含义见 `travel.config.example.json`。

- **文件不存在**：用 AskUserQuestion 一次问清以下几项，然后按 example 的格式写入 `travel.config.json`，并告诉用户以后可以直接改这个文件：
  - 出发城市
  - 驾照（持哪里的驾照）
  - 同行人数，包括儿童及年龄
  - 预算档位
  - 兴趣偏好
- **用户这次说的和配置不一样**：以这次说的为准，不要改配置文件。

### 参数表

| 参数 | 说明 | 来源与缺省 |
|---|---|---|
| **目的地** | 必填 | 用户这次说的。没有就先问 |
| **日期** | 具体日期，或「N 天 + 月份」 | 只有天数时，取一个月后的周五作为开始日期，并告诉用户 |
| **出发城市** | | 配置 `origin` |
| **驾照** | 持哪里的驾照，决定能否在当地自驾 | 配置 `driverLicense`。调研结论为当地不认可时，按不能自驾规划，并告诉用户 |
| **同行人** | 人数、儿童年龄 | 配置 `travelers`。有儿童时，景点和餐厅要考虑亲子友好 |
| **行程框架** | 如「本岛 3 天 + 离岛 2 天」 | 用户这次说的，否则由调研和规划决定 |
| **偏好** | 兴趣、节奏、避开的东西 | 配置 `interests`、`pace`、`avoid`、`notes`，加上用户这次说的 |
| **预算档位** | 经济 / 舒适 / 宽裕 | 配置 `budget` |
| **本币** | 汇率换算和预算的人民币参考 | 配置 `homeCurrency` |
| **slug** | 目的地的英文或拼音，短横线格式，如 `okinawa`、`chiang-mai` | 由目的地生成 |

如果 `research/<slug>/research.json` 已经存在，并且 `generatedAt` 在 30 天以内，问用户：是直接复用旧调研只重新排行程，还是重新调研。

## 2. 并行调研

在**同一条消息**里用 Agent 工具同时启动 3 个 agent：
- `travel-sights-researcher`
- `travel-stay-shop-researcher`
- `travel-food-cost-researcher`

每个 agent 的 prompt 都要包含：
- 目的地、slug、出行月份 `travelMonth`（YYYY-MM）、天数、出发城市、驾照、同行人、行程框架、偏好、预算档位、本币（汇率换算用）
- 输出路径：`research/<slug>/sights.json`、`research/<slug>/stay-shop.json`、`research/<slug>/food-cost.json`
- 一句提醒：「先读 `.claude/skills/plan-trip/research-rules.md`」

等 3 个 agent 都完成再继续。哪个失败了就单独重跑它，不要用自己的知识补数据。

## 3. 合并与校验

```bash
node scripts/validate-research.mjs research/<slug>/sights.json research/<slug>/stay-shop.json research/<slug>/food-cost.json
node scripts/merge-research.mjs research/<slug>
node scripts/validate-research.mjs research/<slug>/research.json
```

- **有错误**：交给对应 agent 修复（用 SendMessage 继续它的会话），或者直接改 JSON。
- **有坐标警告**：抽查几个，用 Nominatim 或官网核对。

## 4. 排行程

用 Agent 启动 `travel-itinerary-planner`，传入：
- `research/<slug>/research.json` 的路径
- 全部出行参数
- 输出路径 `research/<slug>/trip.json`

完成后运行：

```bash
node scripts/validate-trip.mjs research/<slug>/trip.json
```

## 5. 交付

用中文简要回复用户，包括：
- 每天的主题一行
- 预算估算（按档位，不含机票和住宿，另外单列住宿区间）
- 3–5 条最值得注意的发现，比如季节、预约、交通限制
- 待核实的事项
- 使用方法：在 app 左下角点「导入」，选 `research/<slug>/trip.json`
- 详细一览表在 `research/<slug>/README.md`

不要把 JSON 或整张表贴进对话。
