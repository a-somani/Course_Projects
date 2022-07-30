import React from "react"
import { Link } from "react-router-dom"
import Avatar from "../../shared/components/UIElements/Avatar"
import Card from "../../shared/components/UIElements/Card"
import "./UserItem.css"

export type UserItemsProps = {
  id: string
  name: string
  image: string
  placeCount: number
  key: string
}

const UserItem = ({ name, image, placeCount, key, id }: UserItemsProps) => {
  return (
    <li className="user-item" id={id} key={key}>
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar
              image={`${process.env.REACT_APP_BACKEND_URL!}/${image}`}
              alt={name}
            />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
            <h3>
              {placeCount} {placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  )
}

export default UserItem
