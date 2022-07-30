import React from "react"
import Card from "../../shared/components/UIElements/Card"
import PlaceItem from "./PlaceItem"
import "./PlaceList.css"

import { PlaceItemObj } from "./PlaceItem"
import Button from "../../shared/components/FormElements/Button"

type PlaceListProps = {
  items: PlaceItemObj[]
  onDelete: (deletedId: string) => void
}

const PlaceList = (props: PlaceListProps) => {
  const { items, onDelete } = props
  if (items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Would you like to share one?</h2>
          <Button to="/place/new">Share Place</Button>
        </Card>
      </div>
    )
  }

  return (
    <ul className="users-list">
      {items.map((place: any) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          imageUrl={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creator={place.creator}
          coordinates={place.coordinates}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default PlaceList
