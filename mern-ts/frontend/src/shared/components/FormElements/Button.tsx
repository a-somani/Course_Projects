import React from "react"
import { Link } from "react-router-dom"

import "./Button.css"

type ButtonProps = {
  href?: string
  to?: string
  size?: string
  inverse?: boolean
  danger?: boolean
  exact?: boolean
  type?: "button" | "submit" | "reset" | undefined
  children: React.ReactNode
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

const Button = (props: ButtonProps) => {
  if (props.href) {
    return (
      <a
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
        href={props.href}
      >
        {props.children}
      </a>
    )
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
      >
        {props.children}
      </Link>
    )
  }
  return (
    <button
      className={`button button--${props.size || "default"} ${
        props.inverse && "button--inverse"
      } ${props.danger && "button--danger"}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}

export default Button
