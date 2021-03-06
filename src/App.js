import { db } from "./firebaseConfig"
import React, { useEffect, useState } from "react"
import SignIn from "./pages/SignIn"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Loading from "./Components/Loading"
import { useDispatch, useSelector } from "react-redux"
import { collection, getDocs, query } from "firebase/firestore"

function App() {
  const dispatch = useDispatch()

  const isLoading = useSelector((state) => state.isLoading)
  const userCollection = collection(db, "users")
  const array = useSelector((state) => state.array)

  useEffect(() => {
    dispatch({ type: "LOADING_TRUE" })
    let timeout = setTimeout(() => {
      dispatch({ type: "LOADING_FALSE" })
    }, 650)
    return () => clearTimeout(timeout)
  }, [])

  const getArray = async () => {
    const getingDocs = await getDocs(userCollection)
    console.log(getingDocs.length)
    getingDocs.forEach((doc) => {
      if (array.length === 0) {
        dispatch({ type: "ADD_DOCS", payload: { ...doc.data(), id: doc.id } })
      }
    })
  }

  useEffect(() => {
    if (array.length === 0) {
      getArray()
    }
  }, [])

  return (
    <div className="App">
      {isLoading ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home getArray={getArray} />} />
        </Routes>
      )}
    </div>
  )
}

export default App
