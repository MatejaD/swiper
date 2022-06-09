import { signInWithPopup } from "firebase/auth"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { auth, db, provider } from "../firebaseConfig"

export default function SignIn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const usersCollection = collection(db, "users")

  const name = useSelector((state) => state.name)

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        let usersDoc = doc(db, "users", res.user.uid)
        let getUsersDoc = await getDoc(usersDoc)
        localStorage.setItem("token", res.user.uid)
        dispatch({ type: "SET_NAME", payload: res.user.displayName })
        if (!getUsersDoc) {
          await setDoc(
            usersDoc,
            {
              name: res.user.displayName,
              email: res.user.email,
              counter: 0,
            },
            { merge: true }
          )
        }
        console.log(res)
        navigate("/home", { replace: true })
      })
      .catch((error) => console.log(error.message))
  }

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-purple-600">
      <button
        onClick={signInWithGoogle}
        className="absolute top-3 right-5 w-36 h-12 rounded-md border-2 bg-white"
      >
        Sign In
      </button>
      <h2>{name}</h2>
    </main>
  )
}
