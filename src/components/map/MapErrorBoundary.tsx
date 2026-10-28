import { Component, type ReactNode } from 'react'

interface State {
  error: Error | null
}

/** 地图出错时只影响地图区域，不让整个页面白屏 */
export default class MapErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('地图出错', error)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid h-full place-items-center bg-stone-100 text-sm text-stone-500">
        <div className="text-center">
          <p>地图加载出错了</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-2 rounded bg-stone-800 px-3 py-1 text-white"
          >
            重新加载地图
          </button>
        </div>
      </div>
    )
  }
}
