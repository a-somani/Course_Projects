import React from "react"

import Modal from "./Modal"
import Button from "../FormElements/Button"
import { ModalProps } from "./Modal"

interface ErrorModalProps extends ModalProps {
  error: string
}

const ErrorModal = (props: ErrorModalProps) => {
  return (
    <Modal
      onCancel={props.onCancel}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onCancel}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  )
}

export default ErrorModal
