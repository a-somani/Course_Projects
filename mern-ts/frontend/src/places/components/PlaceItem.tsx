import { useContext, useState } from "react"
import Card from "../../shared/components/UIElements/Card"
import "./PlaceItem.css"
import Button from "../../shared/components/FormElements/Button"
import Modal from "../../shared/components/UIElements/Modal"
import Map from "../../shared/components/UIElements/Map"
import { AuthContext } from "../../shared/context/auth-context"
import useHttp from "../../shared/hooks/useHttp"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"

export type PlaceItemObj = {
  id: string
  imageUrl: string
  title: string
  description: string
  creator: string
  coordinates: {
    lng: number
    lat: number
  }
  address: string
  onDelete: (deletedPlaceId: string) => void
}

const PlaceItem = ({
  id,
  imageUrl,
  title,
  description,
  coordinates,
  creator,
  address,
  onDelete,
}: PlaceItemObj) => {
  const { userId, token } = useContext(AuthContext)
  const [showMap, setShowMap] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { error, clearError, isLoading, sendRequest } = useHttp()

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL!}/api/places/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + token,
        }
      )
      onDelete(id)
    } catch (error) {}
  }

  return (
    <>
      <ErrorModal show={!!error} error={error} onCancel={clearError} />
      <Modal
        show={showMap}
        onCancel={() => setShowMap(false)}
        header={address}
        contentClass={`place-item__modal-content`}
        footerClass={`place-item__modal-actions`}
        footer={<Button onClick={() => setShowMap(false)}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} zoom={15} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        header={"Are you sure?"}
        contentClass={`place-item__modal-content`}
        footerClass={`place-item__modal-actions`}
        footer={
          <>
            <Button inverse onClick={() => setShowConfirmModal(false)}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Are you sure your want to delete this place? This cannot be undone.
        </p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay={true} />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL!}/${imageUrl}`}
              alt={title}
            />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse={true} onClick={() => setShowMap(true)}>
              VIEW ON MAP
            </Button>
            {userId === creator && (
              <>
                <Button to={`/places/${id}`}>EDIT</Button>
                <Button danger={true} onClick={() => setShowConfirmModal(true)}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
