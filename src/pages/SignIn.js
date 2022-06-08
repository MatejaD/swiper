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
import { auth, db, provider } from "../firebaseConfig"

export default function SignIn() {
  const dispatch = useDispatch()
  const usersCollection = collection(db, "users")
  console.log(usersCollection)

  const name = useSelector((state) => state.name)

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        let usersDoc = doc(db, "users", res.user.uid)
        let getUsersDoc = await getDoc(usersDoc)
        dispatch({ type: "SET_NAME", payload: res.user.displayName })

        await setDoc(
          usersDoc,
          {
            name: res.user.displayName,
            email: res.user.email,
          },
          { merge: true }
        )
        console.log(res)
      })
      .catch((error) => console.log(error.message))
  }

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-purple-600">
      <button
        onClick={signInWithGoogle}
        className="w-36 h-16 rounded-md border-2 bg-white"
      >
        Sign In
      </button>
      <h2>{name}</h2>
    </main>
  )
}
