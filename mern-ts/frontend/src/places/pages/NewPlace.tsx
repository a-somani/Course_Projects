import React, { useContext } from "react"
import Input from "../../shared/components/FormElements/Input"
import "./PlaceForm.css"
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators"
import { useForm } from "../../shared/hooks/useForm"
import Button from "../../shared/components/FormElements/Button"
import useHttp from "../../shared/hooks/useHttp"
import { AuthContext } from "../../shared/context/auth-context"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { useNavigate } from "react-router-dom"
import ImageUpload from "../../shared/components/FormElements/ImageUpload"

const NewPlace = () => {
  const { error, clearError, isLoading, sendRequest } = useHttp()
  const auth = useContext(AuthContext)
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
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

  const navigate = useNavigate()

  const placeSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", formState.inputs.title.value)
      formData.append("description", formState.inputs.description.value)
      formData.append("address", formState.inputs.address.value)
      formData.append("image", formState.inputs.image.value)

      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL!}/api/places`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      )
      navigate("/")
    } catch (error) {}
  }

  return (
    <>
      <ErrorModal show={!!error} error={error} onCancel={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <h2>Add a New Place</h2>
        {isLoading && <LoadingSpinner asOverlay={true} />}
        <Input
          validators={[VALIDATOR_REQUIRE()]}
          element="input"
          type="text"
          label="Title"
          id="title"
          errorText="Please enter a title"
          onChange={inputHandler}
        />
        <Input
          validators={[VALIDATOR_MINLENGTH(5)]}
          element="input"
          type="text"
          label="Description"
          id="description"
          onChange={inputHandler}
          errorText="Please enter a description (at least 5 characters)"
        />
        <Input
          id="address"
          type="text"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onChange={inputHandler}
        />

        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
          center
        />

        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  )
}

export default NewPlace
