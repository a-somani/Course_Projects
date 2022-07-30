import React, { useEffect, useState } from "react"

import UsersList from "../components/UsersList"
import { UserItemsProps } from "../components/UserItem"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import useHttp from "../../shared/hooks/useHttp"

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttp()
  const [loadedUsers, setLoadedUsers] = useState<UserItemsProps[] | []>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL!}/api/users/`
        )

        setLoadedUsers(data.users! as UserItemsProps[])
      } catch (error: any) {}
    }
    fetchUsers()
  }, [sendRequest])

  return (
    <>
      <ErrorModal show={!!error} error={error} onCancel={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay={false} />
        </div>
      )}
      {!!loadedUsers && !isLoading && <UsersList items={loadedUsers} />}
    </>
  )
}

export default Users
