# 冲绳 调研

调研日期 2026-10-28，出行月份 2026-12。共 89 个地点、44 项价格。价格为调研时的参考值，出发前请以官网为准。

> 本文件由 `scripts/merge-research.mjs` 生成，请勿手改；数据在 `research.json`。

## 要点

- 驾照：持中国大陆驾照的游客不能在日本自驾。日本只认两种情况：(1) 1949 年《日内瓦公约》缔约国签发、格式符合该公约的国际驾照（IDP），入境后一年内、且签发后一年内有效；(2) 瑞士、德国、法国、比利时、摩纳哥、台湾的驾照，加上 JAF 或驻日使领馆出的日文译文。中国大陆不是 1949 年公约缔约国，签发不了合格的 IDP；大陆驾照的 JAF 译文只能用来换日本驾照（外免切替），条件是取得驾照后在签发国累计住满 3 个月。网上非正规渠道办的「国际驾照」租车公司可能不收。（来源：https://jaf.or.jp/common/visitor-procedures/about-dltas 、https://www.keishicho.metro.tokyo.lg.jp/multilingual/chinese/traffic_safety/drivers_licenses/index.files/kokusaimenkyo_chinese.pdf ）
- 首里城：复原后的正殿 2026-11-23 起公开，进正殿须预约 30 分钟时段（Webket）；成人票从 ¥400 涨到 ¥1,000。11-23 至 12-31 的票已在 9-1 和 10-1 开卖，12 月上旬请尽快确认还有没有余票；当天如有空位，开场前 15 分钟为止可现场或网上补买。官方预计 11-23 至 12-06 极为拥挤。（来源：https://oki-park.jp/shurijo/ticket_guide/ ）
- 12 月天气与海况：庆良间 12 月平均气温约 19°C；11–2 月北风强，海上常有风浪，有攻略写庆良间「不适合游泳」，船班也可能停航。浮潜要穿湿衣，青之洞窟看当天旗色决定是否开放。宫古岛 12 月白天约 22°C。（来源：https://weather.time-j.net/Climate/Chart/Kerama 、https://okidokey.jp/portal/blog/article.php?slug=okinawa-ferry-day-trip-guide&lang=en 、https://www.veltra.com/jp/yokka/article/miyako_hidden_winter/ ）
- 观鲸：庆良间座头鲸季约为 12 月底至次年 4 月；2025–26 季座间味观鲸团 1-08 开始、预定到 3-25。12 月上旬基本看不到鲸鱼。（来源：https://ryukyushimpo.jp/tag/ホエールウオッチング ）
- 中日航线：2025-11 以来中国航司大幅削减日本航线，2026 年 6 月当月中国大陆赴日航班取消率 37.5%。国航、东航、南航等对 2026-03-29 至 10-24 出发的日本航线客票免费退改，之后的期间目前没找到延长公告。春秋航空自 2025-12-20 起停售浦东–冲绳每日第 2 班。12 月的上海⇄那霸航班请订航司官网可查到的班次，并留意变动。（来源：https://global.hk01.com/即时中国/60366177/6月取消25条中日航线1488航班-中国赴日旅客量连六个月减少 、https://www.nbd.com.cn/articles/2026-01-27/4236360.html 、https://news.ifeng.com/c/8oURAyHVOwV ）
- 渡嘉敷船票 2026-10-01 起涨价：高速船单程 ¥3,300、往返 ¥6,270；渡轮单程 ¥2,200、往返 ¥4,180。不少攻略还在写旧价（¥2,530 / ¥4,810）。当天往返只能坐高速船：泊港 9:00 出发，渡嘉敷 17:00 回程。（来源：https://www.vill.tokashiki.okinawa.jp/material/files/group/1/unntinnkaitei2.pdf ）
- 不自驾的出行方式（有来源的部分）：那霸市内和首里城坐单轨；青之洞窟和八重干濑都有跟团出发的浮潜行程（八重干濑只能坐船去）；宫古岛用出租车（机场到市区 ¥1,500–2,000），周五、周六 16:00 至次日 5:00 有网约车。（来源：https://www.veltra.com/jp/japan/okinawa/miyako_island/a/170164 、https://www.veltra.com/jp/guide/?p=80202 、https://ryukyushimpo.jp/tag/タクシー ）
- 斋场御岳不在入口卖票，要先到南城市地域物产馆买票；当地正研究最迟明年改为全程导览制。2026 年休息日为 11/9–11，12 月照常开放。（来源：https://sefa.okinawa/en/ 、https://ryukyushimpo.jp/economics/entry-5574092.html ）
- 冲绳县住宿税 2027-02-01 起开征（住宿费的 2%，上限 ¥2,000），2026 年 12 月的住宿不受影响。（来源：https://travel.watch.impress.co.jp/docs/news/2142940.html ）
- 日本免税改为退税制（2026年11月1日起，无过渡期）：结账时先付含税价，出示护照，购买记录电子登记；离开日本时，在国际线出发大厅、办理值机之前，到海关或自助终端（可用 Visit Japan Web）核验，海关确认后由店铺退税（信用卡、银行转账、APP 或机场现金，各店不同）。条件：同店同日满5,000日元（税前），购买后90天内出境；取消消耗品的单独类别、50万日元上限和专用封装，但出境前不能食用；一张小票的商品必须全部带齐，否则整单不退；从国内线转国际线时，在最终离开日本的机场办理。日本居民不适用。
- 冲绳特定免税店（DFS，关税免除，和退税制是两套制度）：年满18岁、个人自用即可购买，日本居民也可以；适用的出发航班为那霸机场（国内线、国际线）、那霸邮轮码头，以及宫古机场、下地岛机场的国内线（石垣不在列）；在 T Galleria 或网上下单，到机场柜台凭确认邮件和登机牌提货，当天不取就自动取消；从离岛转机经那霸、中转时间太短时可能取不到货。免关税额度为20万日元，制度已延长到2027年3月底。
- 冲绳县住宿税2027年2月开征（县税2%，每人每晚上限2,000日元；与市町村税重叠时县税部分会下调），2026年12月入住不受影响。
- 酒税：2026年10月1日起酒税改正，冲绳回归特别措施的酒税减免结束；据报道 Orion 啤酒降价、发泡酒和酎ハイ涨价，具体零售价未查到。
- じゃがポックル（Jagapokkuru）是北海道限定商品（北海道原料、北海道工厂生产），不是冲绳伴手礼。
- 住宿区域｜那霸：适合第1–2天。国际通、牧志一带吃饭购物步行可达；旭桥和久茂地离县厅前站、旭桥站近，交通方便；おもろまち靠近 DFS 和 Main Place，相对安静。单轨电车直达机场，市区几天可以不租车。缺点是酒店停车每晚1,100–1,800日元，国际通周日12:00–18:00为步行街，车辆进出受限。
- 住宿区域｜中部：北谷/美浜 American Village 一带，离那霸机场约40分钟。优点是看海边日落、逛美式街区，12月周六有20:00的烟火，北上或回程都顺路，旁边就是 AEON Rycom。缺点是到美丽海水族馆仍要1小时以上，部分酒店停车开始收费（Hilton 自2026年5月起）。
- 住宿区域｜恩纳：西海岸度假村集中，离那霸机场约60–90分钟，到本部半岛比那霸近得多。适合想住海景度假村的人。缺点是房价高，周边吃饭选择少，度假村停车多数要收费（500–1,000日元/天）。
- 住宿区域｜本部：美丽海水族馆和备濑福木林就在旁边，可以早上第一个入馆。缺点是离那霸机场约1小时47分钟，晚上周边店少；第3天当天要回那霸的话，不必在这里住。
- 住宿区域｜宫古岛：三个区域都需要租车。平良市区离宫古机场约10–15分钟，吃饭、购物（公设市场、岛之驿）方便，价位最友好；伊良部/下地岛海景最好，离下地岛机场约10分钟，但离市区约25–35分钟；与那霸前滨（东急）紧邻前滨海滩，离宫古机场约10分钟，适合以海滩为主的行程。
- 建议住宿安排：第1–2天住那霸2晚（国际通或旭桥），不租车，坐单轨电车。第3天早上在机场取车，经冲绳自动车道去美丽海（约1小时47分钟），回程顺路逛 AEON Rycom 或 American Village，最后在豊崎的 Ashibinaa / iias 补货后还车。宫古2晚有两种走法：A）第3天傍晚从那霸飞宫古，住第3、4晚，第5天从宫古离开（行程紧，需确认冬季末班机）；B）第3晚住北谷（如果是周六还能看烟火），第4天上午飞宫古，这样宫古只能住1晚，要住满2晚就得延长到6天。宫古优先住平良（Atoll Emerald 或 Hilton 宫古岛），兼顾吃饭和购物；想住海滩度假村选前滨东急；从下地岛机场进出就选伊良部的 Iraph SUI。注意：「5天」和「宫古2晚」在晚数上对不上，需要和用户确认。
- 只收现金或不收信用卡的店：千日、新垣善哉屋，泊港鱼市场部分摊位。冲绳面老店建议都备好现金。
- 卖完即止：首里そば（常在 14 点前卖完）、丸吉食堂、新垣善哉屋。想吃要中午前去。
- 需要或建议预约：喜八（提前约 1 周）、郷家（淡季也满座）、我那覇豚肉店吃到饱（提前一天）、琉球之牛。
- 12 月季节性：宫古芒果季是 7–8 月，冬季只有冷冻芒果甜品；古宇利岛的海胆盖饭 12 月是否供应需先确认；浮潜要看海况，常改期或停开，冬季穿防寒潜水服。
- 渡嘉敷一日游：阿波连冬季游客少，餐馆营业不定，建议在那霸泊港出发前买好便当或饭团带上岛。可打电话问渡嘉敷村观光协会 098-987-2332。
- 第一牧志公设市场的玩法：1F 买海鲜，拿到 2F 代煮，食材和代煮费分开付。
- 多数价格来自第三方网站且年份不明，2025 年起外卖、外食普遍涨价（如 King Tacos 塔可饭从 ¥800 涨到 ¥950），旧价只能作下限参考。
- 汇率按 Wise 2026-10-28：1 CNY ≈ 23.67 JPY。

## 景点（22）

| 名称 | 区域 | 价格 | 时间 | 标签 | 提示 | 来源 |
|---|---|---|---|---|---|---|
| 冲绳美丽海水族馆<br><sub>沖縄美ら海水族館 (Okinawa Churaumi Aquarium)</sub> | 北部 | JPY 2,180 · 每人 · 成人个人票，含税；20人以上团体 ¥1,730 | 10–2月 8:30–18:30（17:30 停止入馆）<br>建议 2.5–3小时 | 必去、雨天可去 | 官网称到 2027-03-31 无计划休馆（台风等临时休馆除外），年末年初照常营业。官网未列出 16 点后优惠票。冲酱剧场·海豚表演 2027-01-04 至 01-09 暂停，12 月不受影响。工作人员可能要求出示证件。 | [1](https://churaumi.okinawa/guide/info/) [2](https://churaumi.okinawa/guide/hour/) [3](https://churaumi.okinawa/) |
| 古宇利大桥<br><sub>古宇利大橋 (Kouri Bridge)</sub> | 北部 | JPY 0 · 每人 · 通行免费 | 建议 30分钟 | 免费、必去 | 连接屋我地岛与古宇利岛，全长 1,960 m（也有资料写 2,020 m），2005 年通车。桥头有免费停车的观景台，也可以步行上桥。 | [1](https://www.airtrip.jp/travel-column/13758) [2](https://www.openstreetmap.org/way/64181932) |
| 古宇利岛<br><sub>古宇利島 (Kouri Island)</sub> | 北部 |  | 建议 1–2小时 | 海滩 | 有古宇利海滩、古宇利之驿「ソラハシ」。岛北侧海滩有心形石（Heart Rock），「恋之岛」的别称由此而来。坐标为岛屿中心。 | [1](https://www.airtrip.jp/travel-column/13758) [2](https://www.openstreetmap.org/relation/5012699) |
| 今归仁城迹<br><sub>今帰仁城跡 (Nakijin Castle Ruins)</sub> | 北部 | JPY 1,000 · 每人 · 2025-09-01 起的成人价；10人以上团体 ¥800 | 12月（通常期）8:00–18:00（17:30 最后入场）<br>建议 1小时 | 世界遗产 | 全年开放。旧攻略写的 ¥400 / ¥600 已过时。 | [1](https://www.nakijinjoseki-osi.jp/) |
| 备濑福木林道<br><sub>備瀬のフクギ並木 (Bise Fukugi Tree Road)</sub> | 北部 |  | 建议 30–60分钟 | 散步 | 坐标是 OSM 上备濑集落中一个未命名的景点标记，不一定是林道入口。在美丽海水族馆北边，两地很近。 | [1](https://www.openstreetmap.org/node/5895799085) |
| 万座毛<br><sub>万座毛 (Cape Manzamo)</sub> | 恩纳 | JPY 100 · 每人 · 大人小孩同价，学龄前免费 | 11–2月 8:00–19:00（日落即结束参观，可能提前关闭）<br>建议 30–45分钟 | 必去、日落 | 全年无休，台风等自然灾害时可能关闭。停车费官网未写，可致电 098-966-8080 询问。 | [1](https://www.manzamo.jp/) |
| 真荣田岬 · 青之洞窟<br><sub>真栄田岬・青の洞窟 (Cape Maeda / Blue Cave)</sub> | 恩纳 |  | 停车场 12–3月约 7:00–18:00（另一来源写 7–19 时、1/1–1/3 休）<br>建议 2–3小时（参团浮潜） | 浮潜 | 坐标为岬角，青之洞窟观景点约在 26.4428, 127.7736。停车场 180 个车位，每小时 ¥100。洞窟是否开放看当天旗色：蓝旗开放；黄旗只允许潜水店带的团；红/橙旗关闭。洞窟关闭时，很多团会改去附近的 Maeda Flats。冬季（12–2 月）必须穿湿衣；有攻略认为最佳季节是 5–10 月。浪大或有波浪警报时禁止游泳和跳水。当天海况可问管理事务所 098-982-5339。 | [1](https://rurubu.jp/andmore/spot/80043197) [2](https://okinawa-labo.com/en/Okinawa-Blue-House-3808) [3](https://www.jeepe.jp/ja/articles/okinawa-blue-cave-snorkeling-diving-2150) [4](https://www.openstreetmap.org/node/8302889844) |
| 伊良部大桥<br><sub>伊良部大橋 (Irabu Bridge)</sub> | 宫古岛 |  | 建议 30分钟 | 必去 | 连接宫古岛与伊良部岛，过桥后经伊良部岛可到下地岛（17END）。坐标为桥中段（OSM）。桥长、是否收费，本文件未找到来源核实。 | [1](https://www.openstreetmap.org/way/325806590) |
| 与那霸前滨海滩<br><sub>与那覇前浜ビーチ (Yonaha Maehama Beach)</sub> | 宫古岛 |  | 建议 1–2小时 | 海滩、必去 | 12 月：冬季宫古攻略称 11–12 月平均气温约 23–25°C，12 月白天约 22°C。冬季有东北季风。 | [1](https://www.openstreetmap.org/way/1007334733) [2](https://www.veltra.com/jp/yokka/article/miyako_hidden_winter/) |
| 东平安名崎<br><sub>東平安名崎 (Cape Higashi-hennazaki)</sub> | 宫古岛 | JPY 300 · 每人 · 登平安名埼灯台（初中以上；小学以下免费）；岬角本身免费 | 岬角全天开放；灯塔参观时间未核实<br>建议 1小时 | 必去 | 灯塔可以登顶（约 100 级台阶），日本最南的可参观灯塔之一。免费停车约 50 个车位。从宫古机场开车约 35 分钟，出租车约 30 分钟、约 ¥3,500。灯塔票价来自二手资料。 | [1](https://tabi-mag.jp/on0079/) [2](https://www.gltjp.com/zh-hant/directory/item/16203/) [3](https://www.veltra.com/jp/guide/?p=80202) [4](https://www.openstreetmap.org/node/1441709260) |
| 砂山海滩<br><sub>砂山ビーチ (Sunayama Beach)</sub> | 宫古岛 |  | 建议 1小时 | 海滩 | 本文件只核实了坐标（OSM）。拱形岩、是否有救生员等信息未核实。 | [1](https://www.openstreetmap.org/way/496244201) |
| 17END（下地岛）<br><sub>17END (Shimojishima Airport RW17 end)</sub> | 宫古岛 |  | 建议 1小时 | 海滩 | 坐标为估计：按下地岛机场跑道北端推算。17END 是下地岛机场北端跑道旁的海滩，地址为宫古岛市伊良部。北侧 17END 路段禁止车辆通行，要从机场停车场步行（有攻略写从机场步行约 40 分钟）。机场一般停车场 299 个车位，出入时间 7:00–20:30（2025-04-16 更新），周末常满。沙洲只在退潮时露出，去之前查潮汐。 | [1](https://www.pref.okinawa.jp/machizukuri/kowankuko/1012617/1012639/1012642/index.html) [2](https://www.gltjp.com/ja/directory/item/17522/) [3](https://tabi-mag.jp/on0084/) |
| 八重干濑（Yabiji 珊瑚礁群）<br><sub>八重干瀬 (Yabiji)</sub> | 宫古岛 |  | 建议 半天（约4小时团） | 浮潜 | 只能跟船团前往（从池间港、伊良部岛等地出发）。有业者「全年出团」，冬季也有半日行程，会按当天天气和风向调整集合地点或取消。礁区大面积露出水面主要在春夏，12 月看不到。坐标为 OSM 礁区标点。 | [1](https://www.veltra.com/jp/japan/okinawa/miyako_island/a/170164) [2](https://www.veltra.com/jp/japan/okinawa/miyako_island/a/183555) [3](https://www.openstreetmap.org/node/8609437923) |
| 池间大桥<br><sub>池間大橋 (Ikema Bridge)</sub> | 宫古岛 |  | 建议 30分钟 |  | 连接宫古岛与池间岛。本文件只核实了坐标（OSM），桥长未核实。 | [1](https://www.openstreetmap.org/way/1289915833) |
| 首里城公园<br><sub>首里城 (Shurijo Castle)</sub> | 那霸 | JPY 1,000 · 每人 · 2026-11-23 起的新价（原 ¥400）；高中生 ¥760，中小学生 ¥370，6岁以下免费 | 12–3月 收费区 8:30–18:00（17:30 最后入场）；免费区 8:00–18:30<br>建议 1.5–2小时 | 必去、世界遗产、需预约 | 复原后的正殿 2026-11-23 起公开，进正殿须预约 30 分钟时段（Webket：https://webket.jp/pc/ticket/index?fc=00471&ac=8001），每次付款最多 9 张；正殿以外的收费区无需预约。11-23 至 12-31 的票已在 9-1 和 10-1 13:00 分两批开卖，12 月上旬可能所剩不多。当天有空位时，开场前 15 分钟为止可在 Webket 或广福门售票处购买。官方预计 11-23 至 12-06 极为拥挤（此期间不接团体进正殿）。2026-11-22 全园闭园。北殿、南殿等其他建筑之后分阶段复原。 | [1](https://oki-park.jp/shurijo/ticket_guide/) [2](https://oki-park.jp/shurijo/info/15/) [3](https://travel.watch.impress.co.jp/docs/news/2133105.html) [4](https://ryukyushimpo.jp/prtimes/entry-5460622.html) |
| 波上宫<br><sub>波上宮 (Naminoue Shrine)</sub> | 那霸 | JPY 0 · 每人 · 境内自由参观 | 授与所约 9:00–17:00，无休<br>建议 30分钟 | 免费 | 祈祷受理时间另有规定，以当天告示为准。电话 098-868-3697。 | [1](https://rurubu.jp/andmore/spot/80042428) [2](https://www.openstreetmap.org/way/1337981786) |
| 冲绳世界 · 玉泉洞<br><sub>おきなわワールド・玉泉洞 (Okinawa World / Gyokusendo Cave)</sub> | 南部 | JPY 2,000 · 每人 · 成人入园费；官网另有网上预售票 | 9:00–17:30（16:00 最后受理）<br>建议 3–5小时 | 雨天可去 | 官网建议游览 3–5 小时。表演刚结束时玉泉洞入口可能拥挤。夏季限定的洞窟探险团（7/18–9/30）12 月没有。 | [1](https://www.gyokusendo.co.jp/okinawaworld/fee/) [2](https://www.gyokusendo.co.jp/okinawaworld/) |
| 斋场御岳<br><sub>斎場御嶽 (Sefa-utaki)</sub> | 南部 | JPY 600 · 每人 · 官网成人（16岁以上）价；有二手资料写 ¥300，以官网为准 | 11–2月 9:00–17:30（16:45 停止售票，17:00 最后入场）<br>建议 1小时 | 世界遗产 | 门口不卖票，要先到约 500 m 外的南城市地域物产馆买票。2026 年休息日为 6/15–17 和 11/9–11，12 月照常开放。据琉球新报 2026-10-24 报道，当地 DMO 正研究最迟明年改为「全程导览制」，届时票价和参观方式可能变化。 | [1](https://sefa.okinawa/en/) [2](https://www.walkerplus.com/spot/ar1047s05558/data.html) [3](https://ryukyushimpo.jp/economics/entry-5574092.html) |
| 濑长岛 Umikaji Terrace<br><sub>瀬長島ウミカジテラス (Umikaji Terrace)</sub> | 南部 |  | 建议 1–2小时 | 日落 | 在那霸机场南边的濑长岛。本文件只核实了坐标（OSM），没有核实营业时间。 | [1](https://www.openstreetmap.org/node/6833302685) |
| 阿波连海滩（渡嘉敷岛）<br><sub>阿波連ビーチ (Aharen Beach, Tokashiki)</sub> | 庆良间 |  | 建议 半天–1天 | 浮潜、海滩 | 当天往返坐高速船：泊港 9:00→渡嘉敷 9:40，回程 17:00→17:40（冬季时刻表 2026-10-01 至 2027-02-28）。渡轮只有 10:00 去、15:30 回，当天往返太赶。12 月：庆良间 12 月平均气温约 19°C；11–2 月北风强、常有风浪，有攻略写「不适合游泳」。下水要穿湿衣（有业者说在旺季以外长时间下水会冷），船也可能停航。从港口到海滩的交通方式和票价未核实。 | [1](https://okinawa-kankospot.com/en/ferries/tokashiki) [2](https://okidokey.jp/portal/blog/article.php?slug=okinawa-ferry-day-trip-guide&lang=en) [3](https://weather.time-j.net/Climate/Chart/Kerama) [4](https://www.his-j.com/okinawa/op/activity/detail/?opid=1061) [5](https://www.openstreetmap.org/relation/6982081) |
| 古座间味海滩（座间味岛）<br><sub>古座間味ビーチ (Furuzamami Beach, Zamami)</sub> | 庆良间 |  | 建议 半天–1天 | 浮潜、海滩 | 泊港坐高速船 Queen Zamami 约 50 分钟（经阿嘉岛约 70 分钟），渡轮约 2 小时。12 月北风强，常有风浪。座间味是观鲸据点，但 2025–26 季观鲸团到 1-08 才开始（预定到 3-25），往年最早约 12 月底，12 月上旬基本看不到鲸鱼。观鲸协会电话 098-896-4141。 | [1](https://okidokey.jp/portal/blog/article.php?slug=okinawa-ferry-day-trip-guide&lang=en) [2](https://ryukyushimpo.jp/tag/ホエールウオッチング) [3](https://www.bepal.net/play/sea/30435) [4](https://www.openstreetmap.org/relation/6963548) |
| 胜连城迹<br><sub>勝連城跡 (Katsuren Castle Ruins)</sub> | 中部 | JPY 600 · 每人 · Amawari Park 套票（城迹+设施）；没有城迹单独门票；小孩 ¥400 | 城迹约 9:00–18:00（闭城前 30 分钟停止入场）；Amawari Park 9:00–17:30，各来源略有出入<br>建议 1–1.5小时 | 世界遗产 | 基本全年无休，年末年初可能有特别休业。营业时间以官方为准。 | [1](https://www.kkday.com/product/172948) [2](https://www.mapple.net/region/a0705000000_g04030308/spot/) |

## 交通节点（11）

| 名称 | 区域 | 价格 | 时间 | 标签 | 提示 | 来源 |
|---|---|---|---|---|---|---|
| 宫古机场<br><sub>宮古空港 (Miyako Airport, MMY)</sub> | 宫古岛 |  |  | 机场 | 那霸↔宫古：JTA 约 45 分钟、ANA 约 50 分钟，每天多班。出租车到平良市区约 15 分钟、¥1,500–2,000，到东平安名崎约 30 分钟、约 ¥3,500。宫古岛市有网约车，周五、周六 16:00 至次日 5:00 运营。 | [1](https://www.openstreetmap.org/way/57015910) [2](https://travelist.jp/airport_MMY/airport_OKA/airline_ANA/) [3](https://www.nap-camp.com/mag/108152) [4](https://www.veltra.com/jp/guide/?p=80202) [5](https://ryukyushimpo.jp/tag/タクシー) |
| 下地岛机场<br><sub>下地島空港 (Shimojishima Airport, SHI)</sub> | 宫古岛 |  |  | 机场 | 一般停车场 299 个车位，出入时间 7:00–20:30（2025-04-16 更新），周末常满。17END 在机场北端，只能步行前往。2026-01 的旅游问答提到很多租车公司不在下地岛机场接送。那霸是否有直飞下地岛的航班未核实。 | [1](https://www.pref.okinawa.jp/machizukuri/kowankuko/1012617/1012639/1012642/index.html) [2](https://4travel.jp/dm_qa_each-86264.html) [3](https://www.openstreetmap.org/way/57015909) |
| 那霸机场 · 单轨那霸空港站<br><sub>那覇空港 / ゆいレール那覇空港駅 (Naha Airport, OKA)</sub> | 那霸 |  |  | 机场、单轨 | 坐标为单轨那霸空港站。单轨从这里开往终点てだこ浦西站。飞宫古有 JTA（日航系）和 ANA，约 45–55 分钟，每天多班。上海直飞走国际线。航站楼购物见 stay-shop 的 naha-airport-terminal。 | [1](https://www.openstreetmap.org/way/324129153) [2](https://www.yui-rail.co.jp/ticketinfo-ticket/ticketinfo/ticket/) [3](https://travelist.jp/airport_MMY/airport_OKA/airline_ANA/) |
| 单轨旭桥站<br><sub>旭橋駅 (Asahibashi Sta., Yui Rail)</sub> | 那霸 |  |  | 单轨 | OSM 显示站旁有巴士总站（バスターミナル）方向的出口。 | [1](https://www.openstreetmap.org/node/6540547645) |
| 单轨县厅前站<br><sub>県庁前駅 (Kenchomae Sta., Yui Rail)</sub> | 那霸 |  |  | 单轨 | 国际通西端（县厅前一侧）的车站。 | [1](https://www.openstreetmap.org/node/6540547646) [2](https://www.jalan.net/kankou/spt_47201aj2200024177/) |
| 单轨おもろまち站<br><sub>おもろまち駅 (Omoromachi Sta., Yui Rail)</sub> | 那霸 |  |  | 单轨 | T Galleria（DFS）附近，周边有 ORIX、Sky Rental 等租车点（只适用于持合规驾照的人）。 | [1](https://www.openstreetmap.org/node/6540583670) [2](https://www.nta.co.jp/activity/rental_car/okinawa/okinawa/) |
| 单轨首里站<br><sub>首里駅 (Shuri Sta., Yui Rail)</sub> | 那霸 |  |  | 单轨 | 去首里城一般在这站下车，到城门的步行时间未核实。 | [1](https://www.openstreetmap.org/node/6540583676) |
| 泊港 · Tomarin 客运站<br><sub>泊港 とまりん (Tomari Port / Tomarin)</sub> | 那霸 |  |  | 码头、需预约 | 去渡嘉敷、座间味的船都从这里出发。渡嘉敷船出发前 2 个月起可在官方门户 https://tokashiki-ferry.jp/Senpaku/portal 网上预约；船票只在乘船当天出票，开船前 30 分钟买好、前 10 分钟登船。去程回程坐不同船型时，往返票不适用，要在各自码头分别买单程。车辆不能网上订，10:00–17:00 电话预约。座间味船在座间味村官网预约，旺季可能提前 2 个月售罄，需要护照号码等信息。 | [1](https://tokashiki-ferry.jp/Senpaku/portal) [2](https://okidokey.jp/portal/blog/article.php?slug=okinawa-ferry-day-trip-guide&lang=en) [3](https://www.openstreetmap.org/way/53652748) |
| 渡嘉敷港<br><sub>渡嘉敷港 (Tokashiki Port)</sub> | 庆良间 |  |  | 码头 | 冬季时刻表（2026-10-01 至 2027-02-28）：高速船 Marine Liner 泊港 9:00、16:00 出发（约 40 分钟），渡嘉敷 10:00、17:00 回程；渡轮 Ferry Tokashiki 泊港 10:00→11:10，渡嘉敷 15:30→16:40。10–11 月有加开、停航的日子，要看当天运行状态。环境协力税每人 ¥100（高中以上），登船时收取。咨询：渡嘉敷村船舶课那霸事务所 098-868-7541。坐标为 OSM 名为「渡嘉敷港」的点，不是客运站大楼本身。 | [1](https://okinawa-kankospot.com/en/ferries/tokashiki) [2](https://tokashiki-ferry.jp/Senpaku/portal) [3](https://www.vill.tokashiki.okinawa.jp/material/files/group/1/unntinnkaitei2.pdf) [4](https://www.openstreetmap.org/node/5885063593) |
| 座间味港客运站<br><sub>座間味港フェリーターミナル (Zamami Port)</sub> | 庆良间 |  |  | 码头 | 泊港高速船 Queen Zamami 每天 2–3 班，直航约 50 分钟、经阿嘉岛约 70 分钟；渡轮每天 1 班，约 2 小时。退票：7 天前免费，6–2 天前收 30%，前一天收 50%，当天收 100%；因天气停航全额退款。 | [1](https://okidokey.jp/portal/blog/article.php?slug=okinawa-ferry-day-trip-guide&lang=en) [2](https://www.openstreetmap.org/way/93259723) |
| 上海浦东国际机场<br><sub>上海浦东国际机场 (Shanghai Pudong, PVG)</sub> ⚠️ | 上海 |  |  | 机场、出发地 | 浦东↔那霸直飞：东方航空（MU）、春秋航空（9C），飞行约 2 小时 25 分钟–2 小时 40 分钟。第三方数据（2026-09）显示每周约 3–4 班，东航 9:50 从 T1 出发，春秋 10:35 从 T2 出发。吉祥航空据称 2024-11 已停飞该航线。春秋自 2025-12-20 起停售浦东–冲绳每日第 2 班。2026/27 冬春航季（2026-10-25 至 2027-03-27）的实际班表要以航司官网为准。 | [1](https://www.directflights.com/PVG-OKA) [2](https://www.skyscanner.com/routes/pvg/oka/shanghai-pudong-to-okinawa-naha.html) [3](https://news.ifeng.com/c/8oURAyHVOwV) [4](https://www.openstreetmap.org/relation/19842271) |

## 住宿（15）

| 名称 | 区域 | 价格 | 时间 | 标签 | 提示 | 来源 |
|---|---|---|---|---|---|---|
| Orion Hotel Motobu Resort & Spa<br><sub>オリオンホテル モトブ リゾート＆スパ</sub> | 本部 | JPY 61,710–194,480 · 每晚每间 · 11/27–11/28 快照（应为2026年），2人含早：海景豪华房61,710、高层海景85,800、小套房104,545、皇家套房194,480 |  | 高档、停车：约1,000日元（按天还是按次说法不一）、紧邻美丽海水族馆 | 本部町备濑148-1，步行约7分钟到美丽海水族馆；有温泉，是 JUNGLIA 冲绳的合作酒店。 | [1](https://www.jalan.net/yad307948/) [2](https://jcation.com/hotel/detail-2269/) |
| Royal View Hotel 美丽海<br><sub>ロイヤルビューホテル美ら海 (Royal View Hotel Churaumi)</sub> | 本部 |  |  | 中档、停车：费用未查到、步行5分钟到水族馆 | 本部町石川938；经许田IC离那霸机场约1小时47分钟。房价未查到。 | [1](https://www.jalan.net/yad346870/) |
| Hotel Monterey 冲绳 Spa & Resort<br><sub>ホテルモントレ沖縄 スパ＆リゾート (Hotel Monterey Okinawa Spa & Resort)</sub> | 恩纳 | JPY 26,600–29,400 · 每晚每间 · 排行页显示13,300日元/人起（2人约26,600），方案页显示2人29,400起；快照日期不明 |  | 中档、停车：500日元/天、全海景、4个泳池 | 恩纳村冨着1550-1，经冲绳自动车道离那霸机场约60分钟，339间客房，有大浴场。 | [1](https://www.jalan.net/yad311816/) |
| Hyatt Regency 濑良垣岛冲绳<br><sub>ハイアット リージェンシー 瀬良垣アイランド 沖縄 (Hyatt Regency Seragaki Island Okinawa)</sub> | 恩纳 | JPY 40,200–71,800 · 每晚每间 · じゃらん不同快照显示2人约40,200–71,800；另收度假费330日元/人（6岁以上） |  | 高档、停车：1,000日元/天（另有约2,000日元/天选项）、小岛度假村 | 整座小岛都是酒店范围，有桥连到本岛；离那霸机场约90分钟车程。 | [1](https://www.jalan.net/yad383182/) |
| Hotel Atoll Emerald 宫古岛<br><sub>ホテルアトールエメラルド宮古島 (Hotel Atollemerald Miyakojima)</sub> | 宫古岛 | JPY 15,800 · 每晚每间 · じゃらん显示2人纯住宿约15,800起；快照日期不明 |  | 中档、停车：免费（据じゃらん）、平良市区 | 平良下里108-7，离宫古机场约13分钟、下地岛机场约20分钟；海景好，建筑较旧。 | [1](https://www.jalan.net/yad362861/) |
| Hilton 冲绳宫古岛<br><sub>ヒルトン沖縄宮古島リゾート (Hilton Okinawa Miyako Island Resort)</sub> | 宫古岛 |  |  | 高档、停车：约300个车位，代客泊车约1,000日元（待确认）、免费机场接驳 | 平良久贝550-7（トゥリバー地区），离宫古机场约15分钟、下地岛机场约25分钟，有宫古机场免费接驳巴士。2026年4月隔壁新开了 Canopy by Hilton（306间）。房价只查到外币快照，没有写入。 | [1](https://www.jalan.net/yad353775/) [2](https://travel.watch.impress.co.jp/docs/news/2062341.html) |
| Iraph SUI, a Luxury Collection Hotel, 冲绳宫古<br><sub>イラフ SUI ラグジュアリーコレクションホテル 沖縄宮古</sub> | 宫古岛 | JPY 91,000 · 每晚每间 · Best Rate 方案（含晚餐和早餐）2人约91,000起；快照日期不明 |  | 高档、停车：有，费用未查到、伊良部岛、免费机场接送 | 在伊良部大桥桥头，58间客房；离下地岛机场约10分钟、宫古机场约35分钟；两个机场都有免费接送，需提前3天预约。 | [1](https://www.jalan.net/yad377836/) [2](https://www.jalan.net/yad377836/qa/0006312191.html) |
| 宫古岛东急酒店<br><sub>宮古島東急ホテル&リゾーツ (Miyakojima Tokyu Hotel & Resorts)</sub> | 宫古岛 |  |  | 高档、停车：费用未查到、与那霸前滨海滩 | 下地与那霸914，紧邻与那霸前滨海滩，离宫古机场约10分钟。房价没有可靠来源，未写入。 | [1](https://www.jalan.net/yad347149/) |
| THE NEST 那霸<br><sub>THE NEST NAHA</sub> | 那霸 | JPY 14,000 · 每晚每间 · じゃらん显示约7,000日元/人起，按2人1间换算；快照日期不明，不是12月实价 |  | 经济、停车：1,800日元/天、旭桥站步行约5分钟、2025年7月开业 | 那霸西1丁目，旭桥/港区一带；14楼有22米恒温无边泳池。 | [1](https://www.jalan.net/yad305301/) |
| Daiwa Roynet 那霸おもろまち PREMIER<br><sub>ダイワロイネットホテル那覇おもろまちPREMIER</sub> | 那霸 | JPY 13,500 · 每晚每间 · 2人双床纯住宿约13,500起，含早约15,500起；快照日期不明 |  | 经济、停车：1,100日元/晚、おもろまち站步行约6分钟 | 离 T Galleria 和 San-A Main Place 很近，到国际通步行约15分钟。 | [1](https://www.jalan.net/yad325896/) [2](https://www.jalan.net/yad325896/kuchikomi/) |
| Hotel Collective<br><sub>ホテルコレクティブ (Hotel Collective)</sub> | 那霸 | JPY 21,200 · 每晚每间 · じゃらん显示2人约21,200起；快照日期不明 |  | 中档、停车：1,800日元/晚（立体停车场）、国际通沿街 | 那霸松尾2-5-7，在国际通上；周日12:00–18:00步行街期间，车辆只能从浮岛通进出。有大浴场和泳池。 | [1](https://www.jalan.net/yad382520/) |
| Hyatt Regency 那霸冲绳<br><sub>ハイアット リージェンシー 那覇 沖縄 (Hyatt Regency Naha Okinawa)</sub> | 那霸 | JPY 22,950 · 每晚每间 · じゃらん显示2人约22,950起；快照日期不明 |  | 高档、停车：1,500日元/晚、国际通步行3分钟 | 牧志3-6-20，牧志站步行约8分钟，离机场车程约20分钟；有室外泳池，早餐评价高。 | [1](https://www.jalan.net/yad373185/) |
| The Royal Park Hotel Iconic 那霸<br><sub>ザ ロイヤルパークホテル アイコニック 那覇</sub> | 那霸 | JPY 19,040–28,120 · 每晚每间 · じゃらん排行显示约9,520日元/人起（2人1间约19,040）；开业纪念方案（适用2026/1/30–7/31）2人含早28,120起。都不是12月实价 |  | 高档、停车：1,800日元/晚、县厅前站步行约2分钟、2026年1月开业 | 久茂地1-11-1，琉球银行新总部大楼7–13楼，257间客房。泳池只在3–11月开放，12月用不了。 | [1](https://www.jalan.net/yad376067/) [2](https://www.fashion-press.net/news/130406) |
| Vessel Hotel Campana 冲绳<br><sub>ベッセルホテルカンパーナ沖縄 (Vessel Hotel Campana Okinawa)</sub> | 中部 |  |  | 中档、停车：免费（页面乱码，待确认）、北谷美浜、大浴场 | 在北谷美浜，日落海滩前，离那霸机场约40分钟；有展望大浴场、桑拿和屋顶泳池。房价未查到。 | [1](https://www.jalan.net/yad306902/) |
| Hilton 冲绳北谷<br><sub>ヒルトン沖縄北谷リゾート (Hilton Okinawa Chatan Resort)</sub> | 中部 | JPY 37,042 · 每晚每间 · じゃらん显示2人约37,042起；快照日期不明 |  | 高档、停车：2026-05-15起收费，约500日元（金额待确认）、北谷美浜 | 美浜40-1，步行可到 American Village 和海滩，离那霸机场约40分钟。隔壁是 DoubleTree by Hilton 冲绳北谷。 | [1](https://www.jalan.net/yad308366/) |

## 购物（13）

| 名称 | 区域 | 价格 | 时间 | 标签 | 提示 | 来源 |
|---|---|---|---|---|---|---|
| 宫古岛市公设市场<br><sub>宮古島市公設市場 (Miyakojima City Public Market)</sub> | 宫古岛 |  | 8:00–21:00（各店不同，休息日也各店不同）<br>建议 30分钟–1小时 | 市场、宫古牛、便当 | 在平良市区，规模小，上午部分店铺可能没开；便当和熟食便宜，适合买宫古牛。 | [1](https://www.jalan.net/kankou/spt_guide000000185006/) |
| 岛之驿 宫古<br><sub>島の駅みやこ (Shima no Eki Miyako)</sub> | 宫古岛 |  | 10–3月 9:00–18:00，4–9月 9:00–19:00，全年无休<br>建议 1小时 | 伴手礼、特产、免费停车 | 在伊良部大桥附近的平良久贝，免费停车（约46个车位）。雪盐商品、泡盛、黑糖点心、宫古荞麦面齐全，有美食区。宫古机场2楼有分店（10:00–18:00）。有资料写7:30开门，与其他来源不一致。 | [1](https://www.jalan.net/kankou/spt_guide000000218953/) [2](https://japantravel.navitime.com/en/area/jp/spot/02301-1803025) [3](https://www.ana.co.jp/ja/es/japan-travel-planner/okinawa/0000015.html) |
| 雪盐博物馆<br><sub>雪塩ミュージアム (Yukishio Museum)</sub> | 宫古岛 |  | 9:00–17:00（冬季）；夏季至18:00或18:30（来源不一），无休<br>建议 30分钟–1小时 | 雪盐、免费参观、伴手礼 | 地址平良狩俣191，在池间大桥前，离宫古机场约30分钟车程，免费入场。可以吃雪盐冰淇淋，商店有雪盐相关和馆内限定商品。 | [1](https://rurubu.jp/andmore/spot/80129718) [2](https://www.mapple.net/article/30858/) [3](https://www.jalan.net/kankou/spt_alikejpB001196171/map/) [4](https://www.gltjp.com/en/directory/item/13727/) |
| 冲绳奥特莱斯 Ashibinaa<br><sub>沖縄アウトレットモール あしびなー (Okinawa Outlet Mall Ashibinaa)</sub> | 豊崎 |  | 10:00–20:00（餐饮店各异）<br>建议 2小时 | 奥特莱斯、品牌折扣、离机场近 | 107家店，约1,000个车位。2026年1月22日开了冲绳首家 Anker 直营奥特莱斯店。适合自驾日还车前顺路逛。 | [1](https://ja.wikipedia.org/wiki/沖縄アウトレットモールあしびなー) [2](https://www.triptojapan.com/ja/places/okinawa-outlet-mall-ashibinaa/crziMRn4RrSP2Zik4NRc7w) [3](https://www.phileweb.com/news/d-av/202601/14/64296.html) |
| iias 冲绳豊崎<br><sub>イーアス沖縄豊崎 (iias Okinawa Toyosaki)</sub> | 豊崎 |  | 10:00–21:00（部分店铺 9:00 开门或营业到 23:00）<br>建议 2小时 | 购物中心、离机场近、水族馆 | 约3,000个车位。内有 DMM かりゆし水族館、AEON Style、Loft、Bic Camera、优衣库、GU、大创。 | [1](https://ja.wikipedia.org/wiki/イーアス沖縄豊崎) [2](https://livejapan.com/en/in-japan/spot-lj0137760) |
| 国际通<br><sub>国際通り (Kokusai-dori)</sub> | 那霸 |  | 各店不同；每周日 12:00–18:00 为步行街<br>建议 2–3小时 | 伴手礼、街区、步行街 | 全长约1.6km（县厅前到安里三岔路），约600家店，集中买伴手礼最方便，价格是标准游客价。坐标为街道西段的地图标点。 | [1](https://www.jalan.net/kankou/spt_47201aj2200024177/) [2](https://www.jalan.net/kankou/spt_guide000000191995/) |
| 平和通 / 市场本通商店街<br><sub>平和通り・市場本通り (Heiwa-dori arcades)</sub> | 那霸 |  | 各店不同<br>建议 1–2小时 | 伴手礼、拱廊商店街、本地价 | 以本地顾客为主，衣物、食品、杂货较便宜，能淘到少见的东西；有百年琉球玻璃老店久場川屋（くば笠屋）本店。 | [1](https://www.jalan.net/kankou/spt_47201aj2200025764/) |
| 第一牧志公设市场<br><sub>那覇市第一牧志公設市場 (Makishi Public Market)</sub> | 那霸 |  | 8:00–22:00（各店不同），2楼食堂约至20:00最后点餐；第4个周日休（多数资料写12月除外）<br>建议 1–2小时 | 市场、海鲜、代客加工 | 2023年3月在原址重新开业。1楼买海鲜可拿到2楼食堂代加工。12月第4个周日是否营业各来源说法不一，去前确认。 | [1](https://ja.wikipedia.org/wiki/第一牧志公設市場) [2](https://rurubu.jp/andmore/spot/80042438) [3](https://www.gltjp.com/ja/directory/item/13361/) |
| T Galleria 冲绳 by DFS<br><sub>Tギャラリア 沖縄 by DFS</sub> | 那霸 |  | 10:00–20:00（季节、店铺不同；じゃらん写11:00开门），全年无休<br>建议 1–2小时 | 免税、奢侈品、化妆品、冲绳特定免税 | 紧邻单轨おもろまち站，有免费停车服务。适用冲绳特定免税：从那霸机场（国内线、国际线）或宫古机场、下地岛机场（国内线）出发均可，年满18岁、个人自用，在机场柜台提货。 | [1](https://www.walkerplus.com/spot/ar1047s576265/data.html) [2](https://www.jalan.net/kankou/spt_guide000000215970/) [3](https://www.dfs.com/en/okinawa/terms-and-conditions-okinawa/general-article-japan) |
| San-A 那霸 Main Place<br><sub>サンエー那覇メインプレイス (San-A Naha Main Place)</sub> | 那霸 |  | 9:00–22:00（食品馆至23:00），无休<br>建议 1–2小时 | 购物中心、超市、伴手礼 | 停车位约2,500个。超市里的冲绳点心、黑糖、泡盛是本地价，适合批量买。 | [1](https://ja.wikipedia.org/wiki/サンエー那覇メインプレイス) [2](https://rurubu.jp/andmore/spot/80042591) |
| 那霸机场旅客航站楼<br><sub>那覇空港旅客ターミナル (Naha Airport)</sub> | 那霸 |  | 设施时间：国内线区域 6:00–24:00，国际线区域 6:00–22:00（各店不同）<br>建议 1小时 | 机场、伴手礼、DFS | 国内线2楼出发大厅集中了大量伴手礼店；国内线候机区内有 DFS；国际线与国内线之间的连接设施内有商业街「ゆいにちストリート」。坐标为国内线航站楼1楼观光案内所。设施时间来源为2021年规程，偏旧。 | [1](https://ja.wikipedia.org/wiki/那覇空港) [2](https://www.cab.mlit.go.jp/wcab/file/nahar3.3.25.pdf) [3](https://www.jalan.net/kankou/spt_47201aa1030000649/) |
| 美浜 American Village / Depot Island<br><sub>美浜アメリカンビレッジ・デポアイランド (Mihama American Village)</sub> | 中部 |  | 各店不同（未查到统一营业时间）<br>建议 2–3小时 | 美式街区、日落、烟火 | 2026年12月北谷烟火均为20:00开始：12/5、12/12、12/19、12/24、12/25、12/26，免费观看，强风时可能取消。Depot Island 地址为北谷町美浜9-1。 | [1](https://www.openstreetmap.org/node/4443303792) [2](https://ja.wikipedia.org/wiki/美浜アメリカンビレッジ) [3](https://www.depot-island.co.jp/) |
| AEON Mall 冲绳 Rycom<br><sub>イオンモール沖縄ライカム (AEON Mall Okinawa Rycom)</sub> | 中部 |  | 专卖店 10:00–22:00；餐厅 11:00–23:00；AEON Style 2F 8:00–23:00、3F/4F 9:00–22:00<br>建议 2–3小时 | 购物中心、北上顺路 | 约4,000个车位。自驾北部来回可顺路。台风时可能临时提前关门。 | [1](https://okinawarycom.aeonmall.jp/) [2](https://ja.wikipedia.org/wiki/イオンモール沖縄ライカム) [3](https://okinawahai.com/?p=24269) |

## 餐厅（28）

| 名称 | 区域 | 价格 | 时间 | 标签 | 提示 | 来源 |
|---|---|---|---|---|---|---|
| King Tacos 金武本店<br><sub>キングタコス 金武本店 / King Tacos Kin</sub> | 北部 | JPY 950 · 每人 · 起司蔬菜塔可饭 2025-03-20 起由 ¥800 调到 ¥950（2026 年 1 月确认） | 10:30 开门；关门时间来源冲突（21:00 / 1:00） | 塔可饭、发源店、分量大 | 坐标为估计（金武町 Camp Hansen 门前一带）。塔可饭由 Matsuzo Gibo 1984 年创制，Parlor Senri 已关，由家人在 King Tacos 延续。 | [1](https://www.pricey.jp/web/articles/4745) [2](https://www.visitkintown.jp/en/spot/king-tacos-kin-main-branch) [3](https://en.wikipedia.org/wiki/Taco_rice) |
| Seaside Drive-in（恩纳）<br><sub>シーサイドドライブイン / Seaside Drive-in</sub> ⚠️ | 北部 | JPY 550–2,600 · 每人 · シーサイドサンド ¥550、チャップステーキ ¥1,500、炖牛尾 ¥2,600；招牌汤 ¥200（均无年份） | 店内 8:00–20:00，外带 24 小时；周三休（遇节假日会调整） | 美式汽车餐厅、招牌汤 | 电话 098-964-2272，或看官方 SNS 确认。 | [1](https://rurubu.jp/andmore/spot/80043229) [2](https://www.mapple.net/article/49566/) |
| 琉球之牛 恩纳本馆<br><sub>焼肉 琉球の牛 恩納本館 / Ryukyu no Ushi Onna</sub> | 北部 |  |  | 冲绳和牛烤肉、12 部位拼盘、和牛握寿司、需预约 | 半包间式座位，建议预约。价格未查到。北谷店坐标 26.3204, 127.7538。 | [1](https://www.funliday.com/posts/okinawa-yakiniku/) |
| 岸本食堂 本店<br><sub>きしもと食堂 / Kishimoto Shokudo</sub> ⚠️ | 北部 | JPY 500–999 · 每人 · 旧资料：冲绳面 ¥500 起；Tabelog 评价人均约 ¥999 | 11:00–17:30（另说 17:00），周三休；八重岳分店 11:00–19:00 无休 | 冲绳面、老店 | 本部渡久地，可顺路去美丽海水族馆。电话：本店 0980-47-2887，八重岳店 0980-47-6608。 | [1](https://oki-islandguide.com/food_and_drink/kishimoto-shokudo) [2](https://foodle.pro/restaurants/motobu/kishimoto-shokudo) [3](https://japantravel.navitime.com/en/area/jp/spot/02301-1800229/) |
| 新垣善哉屋<br><sub>新垣ぜんざい屋 / Arakaki Zenzaiya</sub> ⚠️ | 北部 | JPY 300 · 每人 · 善哉 ¥300（mapple，无年份；更早资料为 ¥250） | 12:00–18:00，卖完即止；周一休（仅一个来源） | 善哉刨冰、只收现金、卖完即止 | 本部町渡久地，和岸本食堂相距很近。2025 年 7 月仍有人去过。 | [1](https://digjapan.travel/en/spot/id=8511) [2](https://www.mapple.net/region/a0705010000_g03040300/spot/) |
| 本部牧场烤肉 本部店<br><sub>焼肉 もとぶ牧場 もとぶ店 / Yakiniku Motobu Bokujo</sub> ⚠️ | 北部 | JPY 1,500–3,000 · 每人 · Gurunavi：午 ¥1,500 / 晚 ¥3,000（评论多为 2019–20 年），现价可能更高 | 11:30–15:00（LO 14:00）/ 17:00–22:00（LO 21:30） | 本部牛、烤肉、牛排 | 电话 0980-51-6777。Hamoni 写的地址不同，分店需确认。那霸也有分店（OSM 坐标 26.2153, 127.6794）。 | [1](https://gurunavi.com/en/f556000/rev/rst) |
| しらさ食堂（古宇利岛）<br><sub>しらさ食堂 / Shirasa Shokudo</sub> ⚠️ | 北部 | JPY 1,500–4,000 · 每人 · 海胆盖饭约 ¥4,000（用户自报，无日期）；海鲜盖饭 ¥1,500（旧文） |  | 海胆盖饭、海葡萄盖饭、海鲜盖饭 | 营业时间未查到。12 月是否供应海胆未确认，需先问店家。 | [1](https://okinawa.stripes.com/food-drink/shirasa-shokudo-serves-up-seafood-bowls-with-original-sauce.html) [2](https://wanderlog.com/place/details/2681710) |
| Octopus Garden（阿波连海滩）<br><sub>Octopus Garden</sub> ⚠️ | 渡嘉敷 |  |  | 冲绳面、塔可饭、咖喱、屋顶海景座 | 坐标为估计（取阿波连海滩坐标，店在海滩入口）。冬季营业情况和价格未查到。 | [1](https://wanderlog.com/place/details/2681659) |
| 古谢面屋<br><sub>古謝そば屋 / Koja Soba</sub> ⚠️ | 宫古岛 | JPY 880 · 每人 · KOJASOBA ¥880（rurubu，无年份） | 11:00–16:00（LO）；周三休 | 宫古面、老店 | 1932 年起卖宫古面的老店。电话 0980-72-8304。 | [1](https://rurubu.jp/andmore/spot/80042987) [2](https://www.enprimeurclub.com/restaurants/koja-sobaya-okinawa-miyakojima-restaurant) |
| 丸吉食堂<br><sub>丸吉食堂 / Maruyoshi Shokudo</sub> ⚠️ | 宫古岛 | JPY 600–1,300 · 每人 · 宫古面 ¥600 / ソーキ面 ¥1,300（无年份） | 10:30 开门，卖完即止（约 14:00）；休息日来源冲突（周一、二、五 / 不定休） | 宫古面、ソーキ面、取号 | 坐标为估计，只按城辺砂川地区粗估，误差可能超过 1 km。取号制，早去。离宫古机场打车约 15 分钟。电话 0980-77-4211。 | [1](https://rurubu.jp/andmore/article/24736) [2](https://www.mapple.net/article/30654/) |
| 喜八烤肉<br><sub>焼肉 喜八 / Yakiniku Kihachi</sub> ⚠️ | 宫古岛 | JPY 0–8,000 · 每人 · Retty 晚餐预算约 ¥8,000；上盐牛舌 ¥1,650、特上カルビ ¥3,300（2023–24 年评论） | 18:00–22:00；不定休 | 宫古牛、烤肉、需预约 | 坐标为估计（平良下里）。整头采购宫古牛的老店，18 个座位，建议提前约 1 周预约 0980-73-3859。 | [1](https://retty.me/restaurant/100000924342/) |
| 郷家（宫古民谣居酒屋）<br><sub>泡盛と沖縄料理 郷家 / Gouya</sub> | 宫古岛 | JPY 500–1,000 · 每人（演出费） · 民谣演出费：前排 ¥1,000、后排 ¥500（2025 年 1 月点评）；刺身拼盘 2 人份 ¥2,145 起（2025 年 2 月），餐费另计 | 17:30–21:00（2025 年 2 月资料）；周四休；民谣演出每天 19:30 开始 | 冲绳料理、宫古民谣现场、需预约 | 坐标为估计（平良西里 570-2）。点评说淡季也会满座，必须预约。 | [1](https://www.mapple.net/article/30745/) |
| 乐园之果（来间岛）<br><sub>農家れすとらん 楽園の果実 / Rakuen no Kajitsu</sub> ⚠️ | 宫古岛 |  | 11:00–18:00；11–2 月至 17:30 | 芒果圣代、冬季限定水果焗、冷冻芒果 | 坐标为估计（取来间岛中心）。鲜芒果季是 7–8 月；冬季供应冷冻的「蔵出しマンゴー」系列和冬季限定水果焗，12 月能否吃到芒果圣代需电话确认 0980-76-2991。价格未查到。 | [1](https://rurubu.jp/andmore/article/24517) [2](https://www.gltjp.com/ja/directory/item/17833/) |
| 糸满渔民食堂<br><sub>糸満漁民食堂 / Itoman Gyomin Shokudo</sub> ⚠️ | 糸满 | JPY 1,000–2,000 · 每人 · Savor Japan 均价：午 ¥1,000 / 晚 ¥2,000（年份不明）；当日鱼黄油煎定食约 ¥1,300（时价） | 午 11:30–LO 14:30，晚 18:00–LO 21:30；周二休（旧资料） | 鱼黄油煎（イマイユ）、鱼汁、海鲜 | 坐标为估计（按西崎町 4 丁目）。找到的最新报道是 2020 年，当前是否营业需先电话确认 098-992-7277。 | [1](https://savorjapan.com/0006057203) [2](https://allabout.co.jp/gm/gc/446327) [3](https://ryukyushimpo.jp/gourmet/entry-1122689.html) |
| 糸满渔协 鱼中心<br><sub>糸満漁業協同組合 お魚センター / Itoman Fish Market</sub> | 糸满 |  | 约 9:00–18:00 | 刺身、海鲜、鱼市场 | 在道之驿糸满后方，距那霸机场约 15 分钟车程。仓库里有 10 多个鲜鱼摊和熟食摊。 | [1](https://www.gltjp.com/en/article/item/10694/) [2](https://hamoni.jp/en/area/okinawa/itoman/shops) |
| 杰克牛排馆<br><sub>Jack's Steak House / ジャッキーステーキハウス</sub> ⚠️ | 那霸 | JPY 1,500–3,800 · 每人 · Gurunavi 午晚均价约 ¥2,000，Savor Japan 约 ¥1,500；菲力 L 250g ¥3,800（年份不明） | 11:00–22:00；定休日来源冲突（周三休 / 仅元旦、旧盆休） | 美式牛排、菲力牛排、老字号 | 旭桥站步行约 5–8 分钟。是否接受预约未核实，去之前电话确认 098-868-2408。 | [1](https://gurunavi.com/en/f159100/rst) [2](https://rurubu.jp/andmore/spot/80042587) [3](https://travel.navitime.com/en/area/jp/spot/02301-1300749) |
| 88 牛排馆 国际通店<br><sub>Steak House 88 Kokusai-dori / ステーキハウス88 国際通り店</sub> | 那霸 | JPY 1,500–3,000 · 每人 · TableCheck：国际通店 午 ¥1,500 / 晚 ¥2,500，西口店 午 ¥2,500 / 晚 ¥3,000；石垣牛、和牛另计 | 11:00–23:00（LO 22:00） | 牛排、石垣牛、可网上预约 | 可在 TableCheck 预约。国际通一带有多家 88 分店，此坐标是 OSM 上国际通沿线的一家，未确认是否为牧志 3-1-6 的国际通店。 | [1](https://www.tablecheck.com/steakhouse88-kokusaidori) [2](https://www.tablecheck.com/steakhouse88-kokusaidori-nishiguchi) [3](https://digjapan.travel/en/spot/id=8535) |
| 第一牧志公设市场（2F 代客料理）<br><sub>第一牧志公設市場 / Makishi Public Market</sub> | 那霸 | JPY 500–1,000 · 每道（代煮费） · 第三方 2026 指南：一般烹调约 ¥500/道，蒸、盐烤、煮龙虾或虾 ¥600–800，炒、炸 ¥700–1,000；食材在 1F 另按时价购买 |  | 海鲜、夜光贝、龙虾、代客料理（持ち上げ） | 在 1F 买海鲜，拿到 2F 餐厅代煮，食材和代煮费分别付款。新馆 2023 年 3 月在原址重开。营业时间未核实。 | [1](https://japanactivity.com/makishi-public-market-guide) |
| 泊港鱼市场<br><sub>泊いゆまち / Tomari Iyumachi</sub> ⚠️ | 那霸 | JPY 1,100 · 每份刺身 · 仅一条 Trip.com 游记提到一份刺身 ¥1,100，未注明日期 | 6:00–18:00（另有说法约 16:00 收摊；各摊卖完即止） | 刺身、金枪鱼、部分摊位只收现金 | 早去。座位很少，多数人外带或在车里吃。电话 098-868-1096。 | [1](https://www.oki-islandguide.com/attractions/tomari-iyumachi-fish-market) [2](https://uk.trip.com/moments/poi-tomariiyumachi-30762049) [3](https://www.komoot.com/highlight/7126293) |
| ゆうなんぎい（冲绳家庭料理）<br><sub>ゆうなんぎい / Yunangi</sub> ⚠️ | 那霸 | JPY 570 · 每人 · 冲绳面 ¥570 起（年份不明） | 12:00–15:00 / 17:30–22:30；休息日未查到 | 拉夫泰、苦瓜炒、排骨面、排队 | 县厅前站步行约 5 分钟，开门前就有人排队。午餐单点会配米饭、腌菜、味噌汤成定食。电话 098-867-3765。 | [1](https://www.deep-exp.com/cn/okinawa/spot/1872) |
| うりずん（安里）<br><sub>うりずん / Urizun</sub> | 那霸 |  | 17:30–23:00 或 24:00；第 2、4 周日休 / 全年无休（来源冲突） | ドゥル天（田芋饼）、泡盛、居酒屋、可预约 | ドゥル天的发源店，泡盛覆盖全县各酒厂，另有自酿古酒。安里站步行即到，无停车场。电话预约 098-885-2178。 | [1](https://gurunavi.com/en/fazp100/rst) [2](https://en.okinawatraveler.net/okinawa-ryukyuryouri) |
| 首里そば<br><sub>首里そば / Shuri Soba</sub> ⚠️ | 那霸 | JPY 500 · 每人 · 首里そば中碗 ¥500，年份不明，现价可能更高 | 11:30–14:00（另说 14:30），卖完即止；周四、周日休 | 冲绳面、卖完即止 | 限量供应，常在 14 点前卖完。OSM 上有两处同名点，此处取赤田町一带那个，需复核。 | [1](https://rurubu.jp/andmore/spot/80042467) [2](https://www.gltjp.com/ja/directory/item/13454/) |
| 我那覇豚肉店<br><sub>我那覇豚肉店 / Ganaha Butanikuten</sub> | 那霸 | JPY 3,388–3,828 · 每人 · 120 分钟吃到饱：山原豚 ¥3,388 / 阿古猪 ¥3,828（含税）；饮料放题另加 ¥1,958 |  | 阿古猪涮涮锅、吃到饱、需预约 | 吃到饱需提前一天预约。价格来自 Retty 上的 2 号店（カフーナ旭橋），坐标是 OSM 上沖映大通り的本店。营业时间未查到；页面上有两个电话（098-868-1358 / 098-863-5380），需确认。 | [1](https://retty.me/restaurant/100000808299/) |
| 琉球之牛 国际通店<br><sub>焼肉 琉球の牛 那覇国際通り / Ryukyu no Ushi</sub> | 那霸 |  |  | 冲绳和牛烤肉、需预约 | 县内 4 家店（那霸 2 家、北谷、恩纳）。价格未查到，点评站标为偏高。建议预约。 | [1](https://www.funliday.com/pois/27054272) [2](https://www.funliday.com/posts/okinawa-yakiniku/) |
| 千日（冰善哉）<br><sub>千日 / Sennichi</sub> ⚠️ | 那霸 | JPY 500–1,000 · 每人 · 两个 listing 分别写 ¥500 和预算 ¥1,000，均无年份 | 11:30–20:00（冬季至 19:00）；周一休 | 冰善哉、只收现金 | 1962 年开业的老店。旭桥站步行约 10 分钟。电话 098-868-5387。 | [1](https://www.gltjp.com/en/directory/item/13465/) [2](https://japantravel.navitime.com/en/area/jp/spot/02301-1800031/) |
| Blue Seal 牧港本店<br><sub>ブルーシール 牧港本店 / Blue Seal Makiminato</sub> ⚠️ | 中部 | JPY 380 · 每人 · 单球 ¥380、双球 ¥640 是国际通店的数据（年份不明）；本店限定 7 球加软冰淇淋圣代 ¥2,500 |  | 冰淇淋、紫芋、盐金楚糕 | 2024 年翻新。本店单球价格未查到。电话 098-877-8258。 | [1](https://san-tatsu.jp/spots/442661/) [2](https://mom-mom.net/en/travel/places/66f669f09a5ba4cd8509222f) |
| A&W 牧港店<br><sub>A&W Makiminato</sub> | 中部 |  | 6:00–26:00（2025 年 9 月资料）；drive-in 时段更短 | root beer、汉堡、drive-in | 坐标为估计：取的是 OSM 上浦添 58 号沿线的 A&W，未确认是否为牧港店（牧港 4-9-1）。价格未查到。 | [1](https://digjapan.travel/en/blog/id=12706) |
| 浜屋冲绳面（北谷）<br><sub>そば専門店 浜屋 / Hamaya Soba</sub> ⚠️ | 中部 |  |  | 软骨排骨面、冲绳面 | 北谷宫城海岸附近。营业时间、价格未查到。 | [1](https://www.mapple.net/region/a0705010301/spot/) |

## 消费参考

| 项目 | 价格 | 来源 |
|---|---|---|
| 单轨 Yui Rail 单程（成人） | JPY 250–390 · 单程 · 2025-02-01 调价后，起步 ¥250 | [1](https://www.okinawatimes.co.jp/articles/-/1488032) [2](https://ryukyushimpo.jp/economics/entry-4099337.html) |
| 单轨 Yui Rail 1 日券（成人） | JPY 1,000 · 每人 · 首次使用起 24 小时；调价前为 ¥800 | [1](https://www.yui-rail.co.jp/ticketinfo-ticket/ticketinfo/1day-pass/) |
| 单轨 Yui Rail 2 日券（成人） | JPY 1,800 · 每人 · 首次使用起 48 小时 | [1](https://www.yui-rail.co.jp/ticketinfo-ticket/ticketinfo/1day-pass/) |
| 单轨 Yui Rail 信用卡感应乘车当日封顶 | JPY 800 · 每天 · 2025-03 报道的数字，现在是否仍是 ¥800 未核实 | [1](https://ryukyushimpo.jp/economics/entry-4099337.html) |
| 渡嘉敷高速船 Marine Liner 单程（成人） | JPY 3,300 · 单程 · 2026-10-01 起；儿童半价；另收环境税 ¥100 | [1](https://www.vill.tokashiki.okinawa.jp/material/files/group/1/unntinnkaitei2.pdf) [2](https://okinawa-kankospot.com/en/ferries/tokashiki) |
| 渡嘉敷高速船 Marine Liner 往返（成人，那霸出发） | JPY 6,270 · 往返 · 2026-10-01 起；旧价 ¥4,810 已作废 | [1](https://www.vill.tokashiki.okinawa.jp/material/files/group/1/unntinnkaitei2.pdf) [2](https://okinawa-kankospot.com/en/ferries/tokashiki) |
| 渡嘉敷渡轮 Ferry Tokashiki 单程（成人） | JPY 2,200 · 单程 · 2026-10-01 起 | [1](https://www.vill.tokashiki.okinawa.jp/material/files/group/1/unntinnkaitei2.pdf) [2](https://okinawa-kankospot.com/en/ferries/tokashiki) |
| 渡嘉敷渡轮 Ferry Tokashiki 往返（成人，那霸出发） | JPY 4,180 · 往返 · 2026-10-01 起 | [1](https://www.vill.tokashiki.okinawa.jp/material/files/group/1/unntinnkaitei2.pdf) [2](https://okinawa-kankospot.com/en/ferries/tokashiki) |
| 渡嘉敷环境协力税 | JPY 100 · 每人每次 · 高中以上，登船时收取 | [1](https://okinawa-kankospot.com/en/ferries/tokashiki) |
| 座间味高速船 Queen Zamami 往返（成人） ⚠️ | JPY 6,080 · 往返 · 2026-03 资料，可能已调价 | [1](https://okidokey.jp/portal/blog/article.php?slug=okinawa-ferry-day-trip-guide&lang=en) |
| 座间味渡轮 Ferry Zamami 往返（成人） ⚠️ | JPY 4,090 · 往返 · 2026-03 资料，可能已调价 | [1](https://okidokey.jp/portal/blog/article.php?slug=okinawa-ferry-day-trip-guide&lang=en) |
| 机票 那霸→宫古（JAL/JTA 最低价） | JPY 6,840 · 单程 · JAL 页面显示的 2026-09/10 日期最低价，属于促销价，实际价格随日期和余票变动 | [1](https://www.jal.co.jp/domestic/ja-jp/flights-to-miyako) |
| 机票 上海浦东→那霸（春秋航空低价） ⚠️ | USD 118–137 · 单程 · Skyscanner 缓存的 11 月日期示例价，不代表 2026 年 12 月的实际价格 | [1](https://www.skyscanner.com/routes/pvg/oka/shanghai-pudong-to-okinawa-naha.html) |
| 租车 本岛那霸机场一带（起价） | JPY 4,500–5,000 · 每次起价 · NTA 以 2026-11-04 查询的起价，含税；紧凑型 ¥4,500 起，混动/SUV ¥5,000 起。租期未注明，不一定是一天的价格。中国大陆驾照不能用 | [1](https://www.nta.co.jp/activity/rental_car/okinawa/okinawa/) |
| 租车 宫古岛（起价） | JPY 7,150–9,400 · 每天（日归方案起价） · HIS 页面：日归方案 ¥7,150 起；J-net 宫古机场店 J1 级 ¥8,400 起，下地岛机场店 A 级 ¥9,400 起；含免责补偿和税。页面未注明日期 | [1](https://www.his-j.com/kokunai/dst/okinawa/rentcar/) |
| 高速公路 那霸IC→许田IC（普通车，ETC） | JPY 1,040 · 单程 · 冲绳道特别折扣 35.5%，预计到 2027-03-31；ETC 再叠加深夜折扣为 ¥730 | [1](https://www.w-nexco.co.jp/lp/okinawa_ageageetc/) |
| 高速公路 那霸IC→许田IC（普通车，现金） | JPY 1,610 · 单程 · 现金付费车 2024-04 起不再享受折扣 | [1](https://www.w-nexco.co.jp/lp/okinawa_ageageetc/) |
| 汽油 冲绳普通汽油 | JPY 174.9 · 每升 · 2026-10-26 经产省调查；全国平均 ¥170.1 | [1](https://selectra.jp/energy/gasoline) |
| 出租车 冲绳本岛起步价（普通车） | JPY 650 · 起步 1.65 km · 2026-08-24 起（原为 1.75 km ¥600） | [1](https://ryukyushimpo.jp/tag/タクシー) |
| 出租车 宫古机场→平良市区 | JPY 1,500–2,000 · 每车 · 约 15 分钟；宫古起步价未查到 | [1](https://www.veltra.com/jp/guide/?p=80202) |
| 出租车 宫古机场→东平安名崎 | JPY 3,500 · 每车 · 约 30 分钟，大约价 | [1](https://www.veltra.com/jp/guide/?p=80202) |
| 真荣田岬停车场 | JPY 100 · 每小时 · 180 个车位 | [1](https://rurubu.jp/andmore/spot/80043197) |
| JAF 驾照日文译文（用于在日本驾驶） | JPY 6,000 · 每份 · 2026-07-01 起；仅瑞士、德国、法国、比利时、摩纳哥、台湾驾照可凭译文驾驶；只能在日本境内网上申请；换日本驾照用的译文为 ¥6,600 | [1](https://jaf.or.jp/common/visitor-procedures/about-dltas) [2](https://jaf.or.jp/-/media/1/2590/2708/3096/pdf_info_chinese_202607_ippan_001.pdf) |
| 元祖紅芋塔（御菓子御殿）6个装 | JPY 1,296 · 每盒 · 2026年8月刊载价；JAF 2025年10月文章写的是900日元，差距大，需在店里核实 | [1](https://jafmate.jp/drive/must-buy-souvenir_20260822.html) [2](https://jafmate.jp/drive/must-buy-souvenir_20251022.html) |
| 元祖紅芋塔（御菓子御殿）10个装 | JPY 2,160 · 每盒 · 2026年8月刊载价 | [1](https://jafmate.jp/drive/must-buy-souvenir_20260822.html) |
| 雪盐ちんすこう（南風堂）24个装 | JPY 810 · 每盒 · 2026年8月刊载价 | [1](https://jafmate.jp/drive/must-buy-souvenir_20260822.html) |
| 雪盐ちんすこう（南風堂）48个装 | JPY 1,512 · 每盒 · 2026年8月刊载价（2025年版是1,296日元） | [1](https://jafmate.jp/drive/must-buy-souvenir_20260822.html) [2](https://jafmate.jp/drive/must-buy-souvenir_20251022.html) |
| 开口笑（沖縄ハム サーターアンダギー）6个装 | JPY 583 · 每袋 · 2026年8月刊载价 | [1](https://jafmate.jp/drive/must-buy-souvenir_20260822.html) |
| 宫古岛雪盐 120g ⚠️ | JPY 864 · 每袋 · 导游网站刊载价，日期不明 | [1](https://www.gltjp.com/ja/directory/item/16746/) |
| 琉球玻璃杯（glacitta' Tsubu Cup） ⚠️ | JPY 1,760 · 每个 · 2022年1月文章，偏旧 | [1](https://en.hoshinoresorts.com/guide/area/okinawa-area/okinawa/okinawa-omiyage) |
| 冲绳面一碗 | JPY 700–1,000 · 每碗 · 老店的 ¥500–600 旧价多已上涨 | [1](https://onedayawaytravel.com/?p=1630) |
| 定食午餐 | JPY 900–1,500 · 每人 | [1](https://onedayawaytravel.com/?p=1630) [2](https://jasumo.com/?p=11464) |
| 居酒屋晚餐 | JPY 2,000–5,000 · 每人 · 日本全国数据（jasumo 2025），非冲绳专项 | [1](https://jasumo.com/?p=11464) |
| 牛排晚餐（Jack's、88 等平价牛排馆） ⚠️ | JPY 1,500–3,800 · 每人 · Gurunavi 均价 ¥2,000，TableCheck 晚餐 ¥2,500–3,000，Jack's 菲力 L ¥3,800（无年份）；石垣牛、和牛另计 | [1](https://gurunavi.com/en/f159100/rst) [2](https://www.tablecheck.com/steakhouse88-kokusaidori) [3](https://rurubu.jp/andmore/spot/80042587) |
| 宫古牛烤肉晚餐 ⚠️ | JPY 4,000–8,000 · 每人 · 焼肉 牛平 晚 ¥4,000（Gurunavi）；喜八预算约 ¥8,000（Retty，2023–24 年） | [1](https://gurunavi.com/en/fc3m800/mn/course1/1/rst) [2](https://retty.me/restaurant/100000924342/) |
| 便利店一餐 | JPY 200–700 · 每人 · 饭团、三明治加饮料 ¥200–500；便当 ¥400–700 | [1](https://jasumo.com/?p=11464) |
| 咖啡店早餐（吐司 + 鸡蛋 + 咖啡） | JPY 500–1,000 · 每人 · 单杯咖啡价格未查到；便利店罐装咖啡 ¥100–150 | [1](https://jasumo.com/?p=11464) |
| Blue Seal 冰淇淋单球 ⚠️ | JPY 380 · 每份 · 国际通店数据，双球 ¥640；年份不明 | [1](https://mom-mom.net/en/travel/places/66f669f09a5ba4cd8509222f) |
| 庆良间浮潜（那霸出发，半日） | JPY 6,000–8,500 · 每人 · 含船费、保险、导游、装备（阪急 2025 年 4 月起）；asoview、Veltra ¥6,800 起；冬季视海况常停开 | [1](https://x.hankyu-travel.com/f_up/data/pdf/osa_d/osa_d_281834.pdf) [2](https://www.asoview.com/item/activity/pln3000012607/) |
| 宫古岛海龟浮潜 | JPY 3,900–10,000 · 每人 · 岸边出发约 ¥3,900–7,000；包团约 ¥10,000 起；冬季多数店免费借防寒潜水服 | [1](https://www.asoview.com/item/activity/pln3000044727/) [2](https://www.asoview.com/item/activity/pln3000039940/) [3](https://www.veltra.com/jp/japan/okinawa/miyako_island/a/187320) |
| 每日预算：穷游（不含机票、酒店） ⚠️ | JPY 6,000–9,000 · 每人每天 · 约 ¥250–380 人民币。按 jasumo 餐饮档位（¥2,000–3,000/天）加本地交通、门票推算，不含浮潜等活动 | [1](https://jasumo.com/?p=11464) [2](https://onedayawaytravel.com/?p=1630) |
| 每日预算：中等（不含机票、酒店） ⚠️ | JPY 13,000–20,000 · 每人每天 · 约 ¥550–850 人民币。按 jasumo 餐饮档位（¥4,000–6,000/天）加租车分摊、门票推算；onedayawaytravel 中档全包（含住宿）¥12,000–23,000 | [1](https://jasumo.com/?p=11464) [2](https://onedayawaytravel.com/?p=1630) |
| 每日预算：舒适（不含机票、酒店） ⚠️ | JPY 30,000–45,000 · 每人每天 · 约 ¥1,270–1,900 人民币。按 jasumo 高档餐饮（¥10,000+/天）加和牛晚餐、租车、门票推算 | [1](https://jasumo.com/?p=11464) |
| 汇率 JPY→CNY | CNY 0.042 · 每 1 日元 · Wise 2026-10-28：1 JPY = 0.04225 CNY，即 1 CNY ≈ 23.67 JPY，¥10,000 ≈ 423 元人民币；近 7 日 0.0422–0.0426 | [1](https://wise.com/gb/currency-converter/jpy-to-cny-rate/history) |

## 待核实

- 持香港驾照的人能否办 IDP 并在日本驾驶：本次没有找到来源，需要查香港运输署或日本警察厅。
- 不自驾时的一日游巴士团、包车出租车、本岛北部高速巴士（如 Yanbaru Express）的班次和价格：本次没有查到来源。
- 首里城正殿 12 月上旬各时段还剩多少票，要在 Webket 上实时查。
- 上海浦东⇄那霸 2026/27 冬春航季的实际班次、频率和票价；中国航司 10-24 之后是否继续免费退改。
- Yui Rail 1 日 / 2 日券价格和信用卡封顶 ¥800：官网屏蔽了抓取，数字来自搜索摘要和 2025-03 报道。
- 斋场御岳票价：官网写 ¥600，二手资料写 ¥300，以官网为准。
- 东平安名崎灯塔参观时间；¥300 票价来自二手资料。
- 宫古岛出租车起步价。
- 渡嘉敷「从渡嘉敷出发的往返票」价格（官方 PDF 版面解析不清）；座间味航线 2026 年最新票价；座间味观鲸团价格（只找到年份不明的 ¥5,400 / ¥7,700）。
- 12 月庆良间、宫古的海水温度（约 22–23°C 只是经验值）；冬季海滩是否还有救生员和防水母网。
- 渡嘉敷港到阿波连海滩的村营巴士班次和票价。
- 17END 坐标为估算值；伊良部大桥、池间大桥的长度，以及是否收费。
- 那霸⇄宫古是否还有 RAC 执飞；那霸⇄下地岛是否有直飞（Skymark 等）。
- 美国村、Umikaji Terrace、备濑福木林道、砂山海滩的营业时间和收费（本文件只核实了坐标）。
- 真荣田岬冬季因北风关闭的频率；停车场冬季营业时间各来源不一致。
- 美丽海水族馆是否还有 16 点后优惠票（官网票价页没有列出）。
- 胜连城迹的确切开放时间（各来源有出入）。
- 各区域房价区间（经济/中档/高档）原本是估算值，没有可靠来源，没有写入；各酒店价格都是预订站快照，日期多数不明，不代表2026年12月上旬实价。
- 经济型住宿只调研了那霸；北谷、恩纳、本部、宫古岛的经济型选项（民宿、公寓式酒店等）未调研。
- 宫古岛东急酒店：有预订站显示约42,055日元起，但具体是哪个网站、什么日期和条件都不明，没有写入。Hilton 冲绳宫古岛的房价只查到外币快照（约合38,000–45,000日元），没有写入。DoubleTree by Hilton 冲绳北谷（2人约33,282起）的坐标未取得，也没有写入。
- Canopy by Hilton 冲绳宫古岛度假酒店（2026-04-01开业，平良久贝トゥリバー地区）：Nominatim 无法连接，坐标未取得，已从 places 中删除。
- 伊良部大桥 海之驿（いらぶ大橋 海の駅，伊良部字池間添1092-1，1楼卖特产、2楼餐厅）：Nominatim 无法连接，坐标和营业时间都没取到，已删除。「Island Market Irabu」没有找到对应设施。
- 营业时间待确认：国际通、平和通各店，American Village / Depot Island 各店，那霸机场各店铺（设施时间来源是2021年规程）；T Galleria 是10:00还是11:00开门；第一牧志市场12月第4个周日是否营业；岛之驿宫古开门时间（9:00还是7:30）；雪盐博物馆夏季关门时间。
- 各购物点的免税/退税对应情况没有逐一核实（例如 AEON Rycom 的免税柜台只见于第三方资料）。
- 伴手礼价格：元祖紅芋塔6个装有900和1,296两种说法；雪盐120g（864日元）和琉球玻璃杯（1,760日元）的来源日期不明或偏旧；Blue Seal 商品、Orion 啤酒零售价、泡盛（机场7年古酒7,560日元是旧资料）、黑糖、壶屋烧/Yachimun 陶器、风狮爷 shisa（有资料写200–20,000日元以上，来源不确定）的价格都没有可靠的近期来源；2026年的冲绳限定 Calbee 商品没有查到。
- 停车费来自乱码页面或说法不一，待确认：Vessel Campana（免费？）、Hilton 北谷（2026年5月起收费的具体金额）、Orion 本部（按天还是按次）、Hilton 宫古岛（代客泊车）、Iraph SUI、宫古岛东急、Royal View 美丽海。
- JTB 页面显示宫古岛某酒店「2026/12/15 退房起至12/21全馆休业」，但没确认是哪一家（可能是宫古岛东急），预订前要确认。
- 退税制细节：那霸机场国际线退税柜台的具体位置、到账时间，以及日后是否会废除免税制度；冲绳特定免税店制度2027年3月以后是否继续。
- 2026年冬季那霸到宫古的末班机时间未查到。
- 宫古岛市、本部町各自的住宿税开征日期未核实（有资料写为1.2%，上限1,200日元）。
- 坐标说明：商场和景点的坐标取自 Wikipedia 或じゃらん的地图标点，酒店坐标取自じゃらん酒店页的静态地图；国际通、平和通是街道上的一个点；雪盐博物馆的标点名称是「雪塩製塩所」。建议出发前在地图上再核对一次。
- Jack's 牛排馆的定休日（周三，还是只在元旦、旧盆休），以及是否接受预约。
- 第一牧志公设市场的营业时间和 2F 代煮费，只有第三方资料。
- 以下价格是旧数据或无年份：首里そば ¥500、岸本食堂、本部牧场烤肉、Seaside Drive-in、喜八菜单价、Blue Seal 单球、古谢面屋、丸吉食堂。
- 我那覇豚肉店的营业时间和电话；琉球之牛各店的价格。
- 雪盐软冰淇淋的价格；Blue Seal 牧港本店的单球价格；A&W 的价格。
- 糸满渔民食堂现在是否营业，能找到的最新报道是 2020 年。
- 以下坐标是估计的：丸吉食堂（误差可能超过 1 km）、喜八、郷家、King Tacos、乐园之果、A&W、糸满渔民食堂、Octopus Garden。88 牛排馆、A&W 的 OSM 点对应哪家分店也未确认；首里そば OSM 上有两个同名点。
- 12 月：庆良间和宫古的浮潜是否开团，古宇利岛是否供应海胆，阿波连餐馆冬季是否营业。
- Orion 生啤在酒吧或居酒屋的价格、单杯咖啡价格：没有找到有出处的数字，因此未列入 costs。
- 每日预算三档是按 jasumo 的餐饮档位加交通、门票推算的，不是直接来源的数字。
- 浜屋冲绳面、ゆうなんぎい 的休息日和营业时间。
- 任务里提到的宜野湾「Senju」善哉店没有找到，那霸善哉改推了千日。

⚠️ = 可信度低，出发前务必再确认。
