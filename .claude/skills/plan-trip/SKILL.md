---
name: plan-trip
description: 为任意旅行目的地做网络调研（景点、交通、住宿、购物、餐厅、消费价格），并排出可导入旅行规划 app 的逐日行程。用户说「帮我规划去 X 的行程」「调研一下 X」「/plan-trip X」时使用。
argument-hint: <目的地> [天数或日期] [出发城市] [偏好…]
---

# /plan-trip：目的地调研 + 行程生成

流水线：登记目的地 → 3 个调研 agent 并行检索 → 脚本合并、校验 → 规划 agent 排行程 → 网站上自动出现这个目的地和它的行程方案。

产物放在 `research/<slug>/`：

| 文件 | 内容 |
|---|---|
| `destination.json` | 目的地信息：国家、大洲等，网站按 大洲 → 国家 → 目的地 分类展示 |
| `sights.json` / `stay-shop.json` / `food-cost.json` | 各调研 agent 的原始结果 |
| `research.json` | 合并后的完整调研数据（格式：`src/types/research.ts`） |
| `README.md` | 按类别排好的一览表，带来源链接，给人看的 |
| `trips/<方案>.json` | 逐日行程方案。一个目的地可以有多个方案，如 `3d-city.json`、`5d-main-island-miyako.json` |

**目的地的粒度**：一个城市或一个紧凑的旅行地区一个目的地，如「清迈」「冲绳」「京都」。多城市的长线行程（如「福冈 3 日 + 冲绳 5 日」）按主要停留城市拆成多个目的地分别调研；行程方案放在停留最久的那个目的地下，`Trip.destinations` 按顺序列出途经的所有目的地（如 `["fukuoka", "okinawa"]`），这样每个城市页都会列出这个方案。已调研过、30 天内的目的地可以直接复用。

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

如果 `research/<slug>/research.json` 已经存在，并且 `generatedAt` 在 30 天以内，问用户：是直接复用旧调研、只新增一个行程方案，还是重新调研。

### 登记目的地

`research/<slug>/destination.json` 不存在时，按 `src/types/research.ts` 的 `Destination` 写入：
- `slug`、`name`（中文）、`localName`（当地语言或英文）
- `region`（上级行政区，可选）
- `country`（国家中文名）、`countryCode`（ISO 3166-1 两位大写，如 JP、TH）
- `continent`：亚洲 / 欧洲 / 北美洲 / 南美洲 / 大洋洲 / 非洲 / 南极洲
- `summary`：一句话介绍。调研完成后可以根据结果改写得更具体

不要写 `lat` / `lng`，合并脚本会根据调研地点自动计算中心点。

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
- 输出路径 `research/<slug>/trips/<方案>.json`。文件名用英文短横线格式，概括天数和范围，如 `5d-main-island-miyako`；不要覆盖已有方案
- `Trip.destination` 填 `<slug>`；多城市方案另外填 `Trip.destinations`

完成后运行，校验所有目的地、调研和方案是否一致：

```bash
node scripts/validate-all.mjs
```

## 5. 交付

用中文简要回复用户，包括：
- 每天的主题一行
- 预算估算（按档位，不含机票和住宿，另外单列住宿区间）
- 3–5 条最值得注意的发现，比如季节、预约、交通限制
- 待核实的事项
- 使用方法：提交并推送 `research/<slug>/` 后，网站侧边栏「🌏 目的地」里会出现这个目的地，进去点「添加到我的行程」即可；本地也可以 `npm run dev` 打开 `#/explore/<slug>` 预览
- 详细一览表在 `research/<slug>/README.md`

不要把 JSON 或整张表贴进对话。
