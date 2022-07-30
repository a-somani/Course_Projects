import React from "react"
import "./MainHeader.css"

const MainHeader = ({ children }: { children: React.ReactNode }) => {
  return <header className="main-header">{children}</header>
}

export default MainHeader
