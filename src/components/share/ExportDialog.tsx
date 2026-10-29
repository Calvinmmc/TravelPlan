import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toPng } from 'html-to-image'
import type { Trip } from '../../types'
import { schematicTripMap, snapshotTripMap } from '../../lib/snapshot'
import Modal from './Modal'
import TripDocument from './TripDocument'

/** 导出图片的最大像素数：iOS Safari 的 canvas 上限约 1670 万像素 */
const MAX_PIXELS = 16_000_000

type Stage = 'map' | 'image' | 'done' | 'error'

const waitForImages = (root: HTMLElement) =>
  Promise.all(
    [...root.querySelectorAll('img')].map((img) =>
      img.complete ? Promise.resolve() : new Promise((r) => img.addEventListener('load', r, { once: true })),
    ),
  )

/**
 * 导出长图 / 打印 PDF。
 * 行程文档渲染在屏幕外的 .print-area 里（直接挂在 body 下），截图用它，打印时也只显示它（见 index.css）。
 */
export default function ExportDialog({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>('map')
  const [mapImage, setMapImage] = useState<string | null>(null)
  const [schematic, setSchematic] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const docRef = useRef<HTMLDivElement>(null)

  // 1. 地图截图；底图加载失败就用示意图
  useEffect(() => {
    let cancelled = false
    snapshotTripMap(trip).then((img) => {
      if (cancelled) return
      setMapImage(img ?? schematicTripMap(trip))
      setSchematic(!img)
      setStage('image')
    })
    return () => {
      cancelled = true
    }
  }, [trip])

  // 2. 整个文档转成 PNG
  useEffect(() => {
    if (stage !== 'image' || !docRef.current) return
    const node = docRef.current
    let cancelled = false
    ;(async () => {
      await waitForImages(node)
      await document.fonts.ready
      const w = node.offsetWidth
      const h = node.scrollHeight
      const url = await toPng(node, {
        width: w,
        height: h,
        pixelRatio: Math.min(2, Math.sqrt(MAX_PIXELS / (w * h))),
        backgroundColor: '#ffffff',
        style: { position: 'static', left: '0', top: '0' },
      })
      if (!cancelled) {
        setImageUrl(url)
        setStage('done')
      }
    })().catch((e) => {
      console.error('导出图片失败', e)
      if (!cancelled) setStage('error')
    })
    return () => {
      cancelled = true
    }
  }, [stage])

  const siteUrl = window.location.href.split('#')[0]

  return (
    <>
      <Modal title="导出长图 / PDF" onClose={onClose}>
        {stage === 'map' && <p className="py-6 text-center text-sm text-stone-500">正在绘制路线图…（底图下载可能要十几秒）</p>}
        {stage === 'image' && <p className="py-6 text-center text-sm text-stone-500">正在生成长图…</p>}
        {stage === 'error' && (
          <p className="py-6 text-center text-sm text-red-500">生成图片失败。可以试试「打印 / 存为 PDF」，或换用电脑浏览器。</p>
        )}
        {stage === 'done' && imageUrl && (
          <>
            <p className="mb-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-stone-600">
              📱 手机：<b>长按图片</b>保存到相册，或直接发送给微信好友
              <br />
              💻 电脑：点「下载图片」
            </p>
            <div className="max-h-[50vh] overflow-y-auto rounded-md border border-stone-200">
              <img src={imageUrl} alt={trip.name} className="w-full" />
            </div>
            {schematic && <p className="mt-2 text-xs text-stone-400">底图没能加载，路线图用的是简易示意图。</p>}
          </>
        )}
        <div className="mt-4 flex gap-2">
          <a
            href={imageUrl ?? undefined}
            download={`${trip.name}.png`}
            className={`flex-1 rounded-md py-2 text-center text-sm text-white ${imageUrl ? 'bg-stone-800 hover:bg-stone-700' : 'pointer-events-none bg-stone-300'}`}
          >
            下载图片
          </a>
          <button onClick={() => window.print()} className="flex-1 rounded-md border border-stone-300 py-2 text-sm hover:bg-stone-50">
            打印 / 存为 PDF
          </button>
        </div>
        <p className="mt-2 text-xs text-stone-400">「存为 PDF」：在打印窗口的目标打印机里选「另存为 PDF」。微信内置浏览器不支持打印，请用电脑。</p>
      </Modal>

      {createPortal(
        <div ref={docRef} className="print-area">
          <div className="bg-white p-8">
            <TripDocument trip={trip} mapImage={mapImage} mapIsSchematic={schematic} />
            <p className="mt-8 border-t border-stone-100 pt-3 text-center text-xs text-stone-400">由「旅行规划」生成 · {siteUrl}</p>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
