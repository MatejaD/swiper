import React, { useEffect, useState } from "react"
import SignIn from "./pages/SignIn"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Loading from "./Components/Loading"
import { useDispatch, useSelector } from "react-redux"

function App() {
  const dispatch = useDispatch()

  const isLoading = useSelector((state) => state.isLoading)

  useEffect(() => {
    dispatch({ type: "LOADING_TRUE" })
    let timeout = setTimeout(() => {
      dispatch({ type: "LOADING_FALSE" })
    }, 650)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="App">
      {isLoading ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      )}
    </div>
  )
}

export default App
