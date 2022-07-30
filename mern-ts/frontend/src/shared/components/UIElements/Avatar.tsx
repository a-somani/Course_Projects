import React from "react"

import "./Avatar.css"

type AvatarProps = {
  className?: string
  image: string
  alt: string
  width?: string
  styles?: React.CSSProperties
}

const Avatar = ({ className, image, alt, width, styles }: AvatarProps) => {
  return (
    <div className={`avatar ${className}`} style={styles}>
      <img src={image} alt={alt} style={{ width: width, height: width }} />
    </div>
  )
}

export default Avatar
