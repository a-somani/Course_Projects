import React from "react"

import UserItem from "./UserItem"
import "./UsersList.css"

import { UserItemsProps } from "./UserItem"
import Card from "../../shared/components/UIElements/Card"
export type UsersListProps = { items: UserItemsProps[] }

const UsersList = ({ items }: UsersListProps) => {
  if (items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    )
  }

  return (
    <ul className="users-list">
      {items.map((user: any) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  )
}

export default UsersList
