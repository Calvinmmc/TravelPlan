import React from 'react'
import ReactDOM from 'react-dom/client'
import 'maplibre-gl/dist/maplibre-gl.css'
import './index.css'
import App from './App'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'

// Windows 不显示国旗 emoji（会显示成 JP、TH 字母），缺国旗字形时加载 Twemoji 国旗字体。
// 字体放在本站 public/fonts/，不依赖外部 CDN
polyfillCountryFlagEmojis('Twemoji Country Flags', `${import.meta.env.BASE_URL}fonts/TwemojiCountryFlags.woff2`)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
