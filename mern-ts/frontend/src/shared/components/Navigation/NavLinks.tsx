import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import { AuthContext } from "../../context/auth-context"
import "./NavLinks.css"

const NavLinks = () => {
  const { isLoggedIn, logout, userId } = useContext(AuthContext)

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">All Users</NavLink>
      </li>
      {isLoggedIn && (
        <>
          <li>
            <NavLink to={`/${userId}/places`}>My Places</NavLink>
          </li>
          <li>
            <NavLink to="/places/new">Add Place</NavLink>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/signin">Sign in</NavLink>
        </li>
      )}
    </ul>
  )
}

export default NavLinks
