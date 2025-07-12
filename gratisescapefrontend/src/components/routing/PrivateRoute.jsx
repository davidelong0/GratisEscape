import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children, roles = [] }) => {
  const { user } = useSelector(state => state.auth)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (roles.length > 0 && !roles.includes(user.ruolo)) {
    return <Navigate to="/" />
  }

  return children
}

export default PrivateRoute
