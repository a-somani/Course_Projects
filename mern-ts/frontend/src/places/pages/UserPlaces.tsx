import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import useHttp from "../../shared/hooks/useHttp"
import { PlaceItemObj } from "../components/PlaceItem"
import PlaceList from "../components/PlaceList"

const UserPlaces = () => {
  const { error, clearError, isLoading, sendRequest } = useHttp()
  const [loadedPlaces, setLoadedPlaces] = useState<PlaceItemObj[]>()
  const userId = useParams().userId

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await sendRequest(
          `http://locahost:5000/api/places/${userId}`
        )
        setLoadedPlaces(data.places)
      } catch (error) {}
    }
    fetchPlaces()
  }, [sendRequest, userId])

  const placeDeletedHandler = (deletedPlace: string) => {
    setLoadedPlaces((prev) =>
      prev!.filter((place) => place.id !== deletedPlace)
    )
  }

  return (
    <>
      <ErrorModal show={!!error} error={error} onCancel={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay={false} />
        </div>
      )}
      {!isLoading && loadedPlaces!.length > 0 && (
        <PlaceList items={loadedPlaces!} onDelete={placeDeletedHandler} />
      )}
    </>
  )
}

export default UserPlaces
