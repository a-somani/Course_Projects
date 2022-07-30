import React from "react"
import ReactDOM from "react-dom"

import "./Backdrop.css"

type BackdropProp = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

const Backdrop = ({ onClick }: BackdropProp) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={onClick}></div>,
    document.getElementById("backdrop-hook")!
  )
}

export default Backdrop
