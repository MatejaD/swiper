import { doc, getDoc, onSnapshot } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../firebaseConfig"

export default function Home() {
  const dispatch = useDispatch()

  const name = useSelector((state) => state.name)

  useEffect(() => {
    const userData = doc(db, "users", localStorage.getItem("token"))
    onSnapshot(userData, (doc) => {
      console.log(doc.data())
      dispatch({ type: "SET_NAME", payload: doc.data().name })
    })
  }, [])

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-green-500"></div>
  )
}
