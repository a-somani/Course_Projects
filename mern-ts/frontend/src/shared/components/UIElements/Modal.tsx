import React from "react"
import ReactDOM from "react-dom"
import Backdrop from "../Navigation/Backdrop"
import { CSSTransition } from "react-transition-group"
import "./Modal.css"

interface OverlayProps {
  className?: string
  headerClass?: string
  contentClass?: string
  footerClass?: string
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  children?: React.ReactNode
  footer?: React.ReactNode
  header?: React.ReactNode
}

const ModalOverlay = ({
  className,
  headerClass,
  footerClass,
  contentClass,
  onSubmit,
  children,
  footer,
  header,
}: OverlayProps) => {
  const content = (
    <div className={`modal ${className}`}>
      <header className={`modal__header ${headerClass}`}>
        <h2>{header}</h2>
      </header>
      <form onSubmit={!!onSubmit ? onSubmit : (e) => e.preventDefault()}>
        <div className={`modal__content ${contentClass}`}>{children}</div>
        <footer className={`modal__footer ${footerClass}`}>{footer}</footer>
      </form>
    </div>
  )

  return ReactDOM.createPortal(content, document.getElementById("modal-hook")!)
}

export interface ModalProps extends OverlayProps {
  show: boolean
  onCancel: () => void
}

const Modal = (props: ModalProps) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames={`modal`}
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  )
}

export default Modal
