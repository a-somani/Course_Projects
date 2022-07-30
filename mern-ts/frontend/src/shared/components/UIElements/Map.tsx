import React, { useEffect, useRef } from "react"
import "./Map.css"
type MapProps = {
  className?: string
  style?: React.CSSProperties
  center: google.maps.LatLngLiteral
  zoom: number
}

const Map = ({ className, style, center, zoom }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current!, {
      center: center,
      zoom: zoom,
    })

    new window.google.maps.Marker({ position: center, map: map })
  }, [center, zoom])

  return (
    <div ref={mapRef} className={`map ${className}`} style={style}>
      Map
    </div>
  )
}

export default Map
