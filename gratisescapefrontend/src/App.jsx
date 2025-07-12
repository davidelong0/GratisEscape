import React from 'react'
import { Routes, Route } from 'react-router-dom'
import routes from './routes'
import Navbar from './components/layout/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {routes.map((route, i) => (
          <Route key={i} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </>
  )
}

export default App


