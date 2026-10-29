# 目的地调研通用规则

所有 `travel-*-researcher` agent 都必须遵守。数据格式定义在 `src/types/research.ts`（`ResearchFile`）。

## 输入（由调用方在 prompt 里给出）
- 目的地、出行月份、天数、出发城市、偏好（可选）
- `slug` 和输出文件路径，如 `research/okinawa/sights.json`

## 检索
- 用 WebSearch / WebFetch。优先级：官方网站 > 当地旅游局 > 近一年的大型攻略站或点评站 > 博客。
- 价格、营业时间以**最近一年**的来源为准；更早的信息要么不用，要么 `confidence: "low"`，并写进 `unverified`。
- 结合出行月份：注意季节性关闭、天气、淡旺季价格、活动和节日。
- 不要编造。查不到的数字留空，不要猜。

## 坐标
- 每个地点都要有 `lat` / `lng`，保留 4 位小数。
- 尽量核实。可以从官网或维基百科取，也可以用 WebFetch 查：
  - Photon：`https://photon.komoot.io/api/?limit=1&q=<地名>`
  - Nominatim：`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=<地名>`（常拒绝连接，Photon 不行时再试）
  - 地名用当地语言或英文。
- 手抄坐标时注意别漏数字，比如把 26.2145 写成 26.1453。校验脚本会对同一 `area` 内的离群点给出警告。
- `area` 用大约 10 km 范围的细分区域，比如「宫古岛·平良」「宫古岛·伊良部」，不要用整个岛或整个城市。这样离群检查才有意义，排程也能按区域分组。
- 只能估计的，`confidence` 最多填 `"medium"`，并在 `tips` 里写明「坐标为估计」。
- 同一目的地的坐标应该落在合理范围内；离群点要复查。

## 价格
- 统一用当地货币（`currency`），写明 `unit`（每人 / 每晚每间 / 单程 …）。
- 有区间就给 `min` / `max`；单一价格时 `min` = `max`。

## 输出
1. 用 Write 把**合法 JSON**（UTF-8，2 空格缩进）写到指定路径，符合 `ResearchFile`：
   - `part` 按自己的职责填写；`generatedAt` 填今天的日期。
   - `id` 用英文短横线格式，且目的地内唯一，如 `kokusai-dori`。
   - 文字字段用中文，`localName` 用当地语言或英文。
   - 每条 `places` / `costs` 至少有一个 `sources` URL。
2. 写完后运行 `node scripts/validate-research.mjs <输出路径>`，有错误就修到通过。
3. 最后给调用方的回复**不要贴 JSON**，只写：
   - 条目数量
   - 3–5 条最重要的发现
   - 没能核实的信息
