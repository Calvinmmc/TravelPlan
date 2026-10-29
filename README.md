# 旅行规划

左边是逐日行程和清单，右边是地图：每天一种颜色的路线，飞机和船画成虚线，点卡片和点地图互相定位。
配套的 `/plan-trip` 命令可以让 Claude 联网调研任意目的地，自动排出能直接导入的行程。

**在线使用：** https://calvinmmc.github.io/TravelPlan/

---

## 一、只用网页（任何人）

打开上面的网址即可，不需要安装任何东西。

- **示例行程**：左侧栏「📚 示例行程」里点一下，就会添加一份到「我的行程」，可以随意修改。
- **新建行程**：「＋ 新建行程」，填名称和日期。
- **添加地点**：点某一天的「＋ 添加地点」，再点地图，地名会自动填上。
- **编辑**：点地点卡片可以改时间、交通方式、花费、备注，也能上移、下移、删除。
- **分享行程**：左下角「导出 JSON」把行程存成文件发给别人，对方用「导入」打开。

> 数据只保存在你自己的浏览器里（换浏览器、清除网站数据会丢失）。重要的行程请「导出 JSON」备份。

---

## 二、用 `/plan-trip` 调研新目的地（装了 Claude Code 的同事）

### 准备（只需一次）

1. 安装 [Node.js](https://nodejs.org/)（20 以上）、Git 和 [Claude Code](https://claude.com/claude-code)。
2. 下载项目并安装依赖：
   ```bash
   git clone https://github.com/Calvinmmc/TravelPlan.git
   cd TravelPlan
   npm install
   ```
3. 配置自己的默认值（可选，第一次运行 `/plan-trip` 时也会问你）：
   ```bash
   cp travel.config.example.json travel.config.json
   ```
   然后按下面的「配置说明」修改 `travel.config.json`。这个文件只在你自己电脑上，不会提交。

### 使用

在项目文件夹里启动 Claude Code，然后输入：

```
/plan-trip 清迈 6天 1月 喜欢美食和夜市
```

它会：

1. 同时启动 3 个调研 agent，分别查**景点和交通**、**住宿和购物**、**餐厅和消费价格**。
2. 用脚本合并、校验数据，检查坐标有没有抄错、来源是否齐全。
3. 由规划 agent 排出逐日行程。

整个过程一般需要 20–40 分钟，产出放在 `research/<目的地>/`：

| 文件 | 用途 |
|---|---|
| `README.md` | 调研一览表：景点、住宿、购物、餐厅、价格，每条都有来源链接 |
| `trip.json` | 逐日行程，在网页左下角「导入」即可使用 |
| `research.json` 等 | 原始结构化数据 |

**分享给大家**：把 `research/<目的地>/` 提交并推送到 GitHub，网站自动更新后，所有人都能在「📚 示例行程」里看到它。

> 调研结果是某个时间点的网络信息，价格、营业时间、交通时刻可能变化。标了 ⚠️ 或「未经调研」的内容，出发前务必再确认。

### 配置说明（`travel.config.json`）

| 字段 | 含义 | 示例 |
|---|---|---|
| `origin` | 出发城市 | `"上海"` |
| `driverLicense` | 你持有的驾照。决定能否在当地自驾，比如中国大陆驾照不能在日本开车 | `"中国大陆"`、`"香港"`、`"国际驾照（IDP）"` |
| `travelers` | 同行人数；有儿童时填年龄，景点和餐厅会考虑亲子 | `{ "adults": 2, "children": 1, "childrenAges": [6] }` |
| `budget` | 预算档位 | `"经济"` / `"舒适"` / `"宽裕"` |
| `homeCurrency` | 本币，用于汇率换算 | `"CNY"` |
| `pace` | 行程节奏 | `"轻松"` / `"适中"` / `"紧凑"` |
| `interests` | 兴趣偏好 | `["美食", "购物", "海岛", "博物馆"]` |
| `avoid` | 想避开的 | `["爬山", "生食"]` |
| `notes` | 其他要求，原样传给 agent | `"带老人，每天步行不超过 1 万步"` |

对话里说的优先于配置文件，比如配置是上海出发，这次说「从杭州出发」，就按杭州。

---

## 三、开发和部署

```bash
npm run dev      # 本地开发，http://localhost:5173
npm run build    # 构建到 dist/
node scripts/validate-research.mjs research/<目的地>/research.json   # 校验调研数据
node scripts/validate-trip.mjs research/<目的地>/trip.json           # 校验行程
node scripts/merge-research.mjs research/<目的地>                     # 合并调研并生成 README
```

**部署自己的一份**：fork 本仓库 → Settings → Pages → Source 选「GitHub Actions」。之后每次推送到 `main` 都会自动校验数据、构建并发布。

### 项目结构

| 路径 | 内容 |
|---|---|
| `src/` | 网页 app（React + TypeScript + Vite，地图用 MapLibre + OpenStreetMap） |
| `.claude/agents/` | 3 个调研 agent 和 1 个行程规划 agent |
| `.claude/skills/plan-trip/` | `/plan-trip` 命令和调研规则 |
| `scripts/` | 数据校验和合并脚本 |
| `research/` | 各目的地的调研结果和行程 |

地图底图来自 [OpenFreeMap](https://openfreemap.org/)，地名查询来自 [Photon](https://photon.komoot.io/)，都是免费的公共服务，个人使用足够；在部分网络环境下加载可能较慢。
