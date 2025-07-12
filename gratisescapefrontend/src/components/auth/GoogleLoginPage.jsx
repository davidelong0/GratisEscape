import React, { useEffect } from 'react'

const GoogleLoginPage = () => {
  useEffect(() => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  }, [])

  return (
    <div className="container mt-5">
      <h2>Reindirizzamento a Google...</h2>
    </div>
  )
}

export default GoogleLoginPage