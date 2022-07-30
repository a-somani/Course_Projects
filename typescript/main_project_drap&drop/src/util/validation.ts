//validation
export interface ValidateInput {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
}

export function validate(input: ValidateInput): boolean {
  let isValid = true

  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0
  }
  if (typeof input.value === "string") {
    isValid = isValid && input.value.trim().length !== 0
    //input.minLength
    if (input.minLength != null) {
      isValid = isValid && input.value.trim().length >= input.minLength
    }
    if (input.maxLength != null) {
      isValid = isValid && input.value.trim().length <= input.maxLength
    }
  } else if (typeof input.value === "number") {
    if (input.minValue != null) {
      isValid = isValid && input.value >= input.minValue
    }
    if (input.maxValue != null) {
      isValid = isValid && input.value <= input.maxValue
    }
  }
  return isValid
}
