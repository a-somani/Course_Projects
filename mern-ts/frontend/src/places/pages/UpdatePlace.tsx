import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import Button from "../../shared/components/FormElements/Button"
import Input from "../../shared/components/FormElements/Input"
import Card from "../../shared/components/UIElements/Card"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import { AuthContext } from "../../shared/context/auth-context"
import { useForm } from "../../shared/hooks/useForm"
import useHttp from "../../shared/hooks/useHttp"
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators"
import "./PlaceForm.css"

const UpdatePlace = () => {
  const { error, clearError, isLoading, sendRequest } = useHttp()
  const [foundPlace, setFoundPlace] = useState({ title: "", description: "" })
  const placeId = useParams().placeId
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  )

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL!}/api/places/${placeId}`
        )
        setFoundPlace(data.place)
        setFormData(
          {
            title: {
              value: data.place.title,
              isValid: true,
            },
            description: {
              value: data.place.description,
              isValid: true,
            },
          },
          true
        )
      } catch (error) {}
    }
    fetchPlace()
  }, [sendRequest, placeId, setFormData])

  if (!foundPlace && !error && !isLoading) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }

  const placeUpdateSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL!}/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      )
      navigate(`/${auth.userId}/places`)
    } catch (error) {}
  }

  return (
    <>
      <ErrorModal show={!!error} error={error} onCancel={clearError} />
      {isLoading && <LoadingSpinner asOverlay={true} />}
      {foundPlace && !isLoading && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            label="Title"
            type="text"
            errorText="Please enter a title"
            validators={[VALIDATOR_REQUIRE()]}
            onChange={inputHandler}
            initValue={foundPlace.title}
            valid={formState.inputs.title.isValid}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            type="textarea"
            errorText="Please enter a description (at least 5 characters)"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onChange={inputHandler}
            initValue={foundPlace.description}
            valid={formState.inputs.description.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  )
}

export default UpdatePlace
