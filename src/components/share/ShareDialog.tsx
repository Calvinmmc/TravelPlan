import { useEffect, useRef, useState } from 'react'
import type { Trip } from '../../types'
import { LONG_LINK_CHARS, shareUrl } from '../../lib/share'
import Modal from './Modal'

interface Props {
  trip: Trip
  onClose: () => void
  onExport: () => void
}

export default function ShareDialog({ trip, onClose, onExport }: Props) {
  const [includeNotes, setIncludeNotes] = useState(true)
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let cancelled = false
    setCopied(false)
    shareUrl(trip, includeNotes).then((u) => !cancelled && setUrl(u))
    return () => {
      cancelled = true
    }
  }, [trip, includeNotes])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // 微信内置浏览器等不支持 clipboard API 时，退回到选中文字复制
      textRef.current?.select()
      document.execCommand('copy')
    }
    setCopied(true)
  }

  const long = url.length > LONG_LINK_CHARS

  return (
    <Modal title="分享行程" onClose={onClose}>
      <section>
        <h3 className="text-sm font-semibold">🔗 分享链接</h3>
        <p className="mt-1 text-xs text-stone-500">
          行程内容就在链接里，对方点开就能看到完整行程和地图，还能一键保存到自己的行程。之后你再修改，对方看到的不会变。
        </p>
        <textarea
          ref={textRef}
          readOnly
          value={url}
          placeholder="正在生成链接…"
          rows={3}
          onFocus={(e) => e.target.select()}
          className="mt-2 w-full resize-none rounded-md border border-stone-200 bg-stone-50 px-2 py-1.5 font-mono text-xs text-stone-500"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-stone-400">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={includeNotes} onChange={(e) => setIncludeNotes(e.target.checked)} />
            包含备注
          </label>
          <span className={long ? 'text-amber-600' : ''}>链接长度 {url.length.toLocaleString()} 字符</span>
        </div>
        {long && (
          <p className="mt-1 rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-700">
            链接比较长，微信里可能被截断或打不开。可以取消「包含备注」缩短链接，或改发下面的长图。
          </p>
        )}
        <button
          onClick={copy}
          disabled={!url}
          className="mt-3 w-full rounded-md bg-stone-800 py-2 text-sm text-white hover:bg-stone-700 disabled:bg-stone-300"
        >
          {copied ? '✓ 已复制，去微信粘贴发送' : '复制链接'}
        </button>
      </section>

      <section className="mt-5 border-t border-stone-100 pt-4">
        <h3 className="text-sm font-semibold">🖼️ 长图 / PDF</h3>
        <p className="mt-1 text-xs text-stone-500">生成一张带路线图的长图，微信里直接看，适合不方便打开网页的人。电脑上还可以打印或存为 PDF。</p>
        <button onClick={onExport} className="mt-3 w-full rounded-md border border-stone-300 py-2 text-sm hover:bg-stone-50">
          生成长图 / PDF
        </button>
      </section>
    </Modal>
  )
}
