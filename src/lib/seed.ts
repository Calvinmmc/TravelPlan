import type { Stop, Trip } from '../types'
import { uid } from './id'

const s = (name: string, lng: number, lat: number, extra: Partial<Stop> = {}): Stop => ({
  id: uid(), name, lng, lat, ...extra,
})

const NAHA_AIRPORT: [number, number] = [127.6459, 26.1958]
const MIYAKO_AIRPORT: [number, number] = [125.295, 24.7828]

/** 首次打开时的示例行程（价格为参考价，单位日元） */
export function demoTrip(): Trip {
  const now = Date.now()
  return {
    id: uid(),
    name: '冲绳 5 日：本岛 + 宫古岛（示例）',
    startDate: '2026-12-03',
    endDate: '2026-12-07',
    currency: 'JPY',
    createdAt: now,
    updatedAt: now,
    days: [
      {
        id: uid(), date: '2026-12-03', title: '抵达那霸 · 国际通购物',
        stops: [
          s('那霸机场', ...NAHA_AIRPORT, {
            time: '10:30', transport: 'flight',
            note: '上海浦东 → 那霸 约 2 小时。出机场坐单轨电车（Yui Rail）进市区，前两天不用租车',
          }),
          s('国际通', 127.685, 26.215, {
            time: '12:00', transport: 'transit',
            note: '单轨到「县厅前」站。午饭 + 逛街：药妆、泡盛、红芋挞、海盐雪糕',
          }),
          s('首里城', 127.7196, 26.2171, {
            time: '15:00', transport: 'transit', cost: 400,
            note: '单轨到「首里」站，步行约 15 分钟。正殿在重建中，可以看修复现场',
          }),
          s('第一牧志公设市场', 127.689, 26.214, {
            time: '18:00', transport: 'transit',
            note: '晚饭：一楼挑海鲜，二楼代加工',
          }),
        ],
      },
      {
        id: uid(), date: '2026-12-04', title: '坐船去渡嘉敷岛',
        stops: [
          s('泊港（那霸）', 127.6795, 26.228, {
            time: '08:30', transport: 'transit',
            note: '高速船 Marine Liner 约 35 分钟，往返约 4,800 日元。需提前网上预约，风浪大时会停航',
          }),
          s('渡嘉敷港', 127.3608, 26.1977, { time: '09:10', transport: 'ferry', cost: 4800 }),
          s('阿波连海滩', 127.35, 26.166, {
            time: '10:00', transport: 'transit',
            note: '港口有接驳巴士。庆良间蓝，浮潜可以看到海龟',
          }),
          s('渡嘉敷港', 127.3608, 26.1977, { time: '16:00', transport: 'transit' }),
          s('泊港（那霸）', 127.6795, 26.228, { time: '16:40', transport: 'ferry', note: '回那霸' }),
        ],
      },
      {
        id: uid(), date: '2026-12-05', title: '自驾北部 · 美丽海水族馆',
        stops: [
          s('万座毛', 127.8507, 26.5047, {
            time: '09:30', transport: 'drive', cost: 100,
            note: '那霸租车出发，走冲绳自动车道约 1 小时。需要中国驾照日文翻译件',
          }),
          s('冲绳美丽海水族馆', 127.878, 26.6943, {
            time: '11:00', transport: 'drive', cost: 2180,
            note: '黑潮之海大水槽能看到鲸鲨，建议留 3 小时。官网查喂食时间',
          }),
          s('古宇利岛', 128.02, 26.704, {
            time: '15:00', transport: 'drive',
            note: '开车过古宇利大桥，桥上风景最好。心形岩',
          }),
          s('美国村', 127.757, 26.316, {
            time: '18:30', transport: 'drive',
            note: '看日落、晚饭、逛街，摩天轮附近停车免费',
          }),
        ],
      },
      {
        id: uid(), date: '2026-12-06', title: '飞宫古岛',
        stops: [
          s('那霸机场', ...NAHA_AIRPORT, {
            time: '08:00', transport: 'drive',
            note: '还车后值机。那霸 → 宫古 约 50 分钟（JTA / ANA），廉航从下地岛机场起降',
          }),
          s('宫古机场', ...MIYAKO_AIRPORT, {
            time: '09:30', transport: 'flight', cost: 15000,
            note: '宫古岛公共交通很少，建议机场直接租车',
          }),
          s('伊良部大桥', 125.221, 24.818, {
            time: '10:30', transport: 'drive',
            note: '全长 3.5 km，日本最长的免费跨海大桥。可以顺路去下地岛的 17END',
          }),
          s('东平安名崎', 125.469, 24.7185, { time: '14:30', transport: 'drive', note: '岛最东端的海岬，有灯塔' }),
          s('与那霸前滨海滩', 125.261, 24.734, {
            time: '17:00', transport: 'drive',
            note: '东洋第一美丽的海滩，适合看日落',
          }),
        ],
      },
      {
        id: uid(), date: '2026-12-07', title: '伴手礼 · 返程',
        stops: [
          s('宫古岛市区（平良）', 125.282, 24.804, {
            time: '09:00', transport: 'drive',
            note: '伴手礼：雪盐、宫古岛芒果干、雪盐金楚糕',
          }),
          s('宫古机场', ...MIYAKO_AIRPORT, { time: '11:30', transport: 'drive', note: '还车，飞那霸转机' }),
          s('那霸机场', ...NAHA_AIRPORT, {
            time: '13:00', transport: 'flight',
            note: '转国际航班回上海。国际线候机楼可以最后买一轮',
          }),
        ],
      },
    ],
  }
}
