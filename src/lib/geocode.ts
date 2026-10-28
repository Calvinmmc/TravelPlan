/** 用 Photon (OSM) 反查坐标对应的地名，失败时返回 null */
export async function reverseGeocode(lng: number, lat: number): Promise<string | null> {
  try {
    const res = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}&limit=1`)
    if (!res.ok) return null
    const data = await res.json()
    const p = data.features?.[0]?.properties
    if (!p) return null
    return p.name ?? ([p.street, p.housenumber].filter(Boolean).join(' ') || p.city || null)
  } catch {
    return null
  }
}
