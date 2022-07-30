import React, { useEffect, useReducer } from "react"
import { validate } from "../../../util/validators"
import "./Input.css"

type InputProps = {
  label?: string
  id: string
  element: React.HTMLInputTypeAttribute
  type: string
  rows?: number
  placeholder?: string
  errorText?: string
  initValue?: string
  valid?: boolean
  validators: any[]
  onChange: (id: string, value: string, isValid: boolean) => void
}

const inputReducer = (
  state: { value: string; isValid: boolean; isTouched: boolean },
  action: { type: string; val: string; validators?: any[] }
) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      }
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      }
    default:
      return state
  }
}

const Input = ({
  label,
  id,
  element,
  type,
  rows,
  placeholder,
  validators,
  errorText,
  onChange,
  initValue,
  valid,
}: InputProps) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initValue ? initValue : "",
    isValid: !!valid,
    isTouched: false,
  })

  const touchHandler = () => {
    dispatch({ type: "TOUCH", val: "" })
  }

  const changeHandler = (e: React.ChangeEvent<any>) => {
    dispatch({ type: "CHANGE", val: e.target.value, validators: validators })
  }

  const InputElement =
    element === "input" ? (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={id}
        rows={rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    )

  const { value, isValid } = inputState

  useEffect(() => {
    onChange(id, value, isValid)
  }, [id, value, isValid, onChange])

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={id}>{label}</label>
      {InputElement}
      {!inputState.isValid && inputState.isTouched && <p>{errorText}</p>}
    </div>
  )
}

export default Input
