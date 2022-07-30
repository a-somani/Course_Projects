import React, { ReactNode } from "react"

import "./Card.css"

type CardProps = {
  className?: string
  children: ReactNode
  styles?: React.CSSProperties
}

const Card = ({ className, children, styles }: CardProps) => {
  return (
    <div className={`card ${className}`} style={styles}>
      {children}
    </div>
  )
}

export default Card
