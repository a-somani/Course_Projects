import React, { useContext, useState } from "react"
import Button from "../../shared/components/FormElements/Button"
import Input from "../../shared/components/FormElements/Input"
import Card from "../../shared/components/UIElements/Card"
import "./Auth.css"
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators"
import { useForm } from "../../shared/hooks/useForm"
import { AuthContext } from "../../shared/context/auth-context"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import useHttp from "../../shared/hooks/useHttp"
import ImageUpload from "../../shared/components/FormElements/ImageUpload"

const Auth = () => {
  const { login } = useContext(AuthContext)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const { isLoading, error, sendRequest, clearError } = useHttp()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
    },
    false
  )

  const authSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isLoginMode) {
      try {
        const formData = new FormData()
        formData.append("email", formState.inputs.email)
        formData.append("name", formState.inputs.name)
        formData.append("password", formState.inputs.password)
        formData.append("image", formState.inputs.image)

        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL!}/api/users/signup`,
          "POST",
          formData
        )

        login(data.userId, data.token)
      } catch (error: any) {}
    } else {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL!}/api/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        )

        login(data.userId, data.token)
      } catch (error: any) {}
    }
  }

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.email.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      )
    }
    setIsLoginMode((prev) => !prev)
  }

  return (
    <>
      <ErrorModal error={error} show={!!error} onCancel={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay={true} />}
        <h2>Sign In to YourPlaces</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <>
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name"
                onChange={inputHandler}
              />
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText={`Error with image upload, file type may be unsupported`}
              />
            </>
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onChange={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a password of at least 6 characters"
            onChange={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? "SIGN UP" : "LOGIN"}
        </Button>
      </Card>
    </>
  )
}

export default Auth
