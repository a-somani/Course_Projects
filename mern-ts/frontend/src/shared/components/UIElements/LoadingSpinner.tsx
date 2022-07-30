import React from "react"

import "./LoadingSpinner.css"

interface LoadingSpinnerProps {
  asOverlay: boolean
}

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
      <div className="lds-dual-ring"></div>
    </div>
  )
}

export default LoadingSpinner
