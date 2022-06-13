import { signInWithPopup, signOut, GithubAuthProvider } from "firebase/auth"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { auth, db, gitProvider, provider } from "../firebaseConfig"
import homeImg from "../Images/home.jpg"

export default function SignIn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    localStorage.setItem("token", "notLoggedIn")
  }, [])

  const [isOpen, setIsOpen] = useState(false)

  const usersCollection = collection(db, "users")

  const name = useSelector((state) => state.name)

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        let usersDoc = doc(db, "users", res.user.uid)
        let getUsersDoc = await getDoc(usersDoc)
        localStorage.setItem("token", res.user.uid)
        dispatch({
          type: "SET_USER",
          name: res.user.displayName,
          email: res.user.email,
          photo: res.user.photoURL,
          id: res.user.uid,
        })

        await setDoc(
          usersDoc,
          {
            name: res.user.displayName,
            email: res.user.email,
            photo: res.user.photoURL,
            id: res.user.uid,
          },
          { merge: true }
        )

        navigate("/home", { replace: true })
      })
      .catch((error) => console.log(error.message))
  }

  const signInWithGitHub = async () => {
    signInWithPopup(auth, gitProvider)
      .then(async (result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  const signOutFunc = async () => {
    signOut(auth)
      .then(async () => {})
      .catch((error) => console.log(error))
  }

  return (
    <main className="w-screen min-h-screen relative flex flex-col justify-center items-center bg-purple-600">
      {/* Cover Image */}
      <div
        style={{ backgroundImage: `url(${homeImg})` }}
        className="bg-image w-full h-screen flex flex-col justify-start  items-center"
      >
        <div className="w-full h-20 flex justify-between items-center z-10 px-4">
          <div className="w-36 h-full flex justify-center items-center">
            <h1 className="text-5xl text-white text-center">Swiper</h1>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-36 h-12 text-xl font-medium rounded-md bg-white"
          >
            Sign Up
          </button>
        </div>
        {isOpen && (
          <div className="fixed left-0 top-0 z-20 w-screen h-screen flex justify-center items-center bg-black bg-opacity-80 ">
            <div
              onClick={() => setIsOpen(true)}
              className="w-1/3 h-2/3 flex flex-col justify-between items-center bg-slate-200 rounded-md z-30"
            >
              <div className="w-full h-1/4 text-2xl border-b-4 border-black flex justify-center items-center">
                <h2>Sign In Below</h2>
              </div>
              <div className="w-full h-3/4 flex flex-col justify-center items-center gap-2">
                <button
                  onClick={signInWithGoogle}
                  className="login-with-google-btn"
                >
                  Sign in with Google
                </button>
                <button
                  style={{ height: "2.5rem" }}
                  class="gh-button"
                  href="//github.com/chrisnager/simple-paper-spinner"
                >
                  <span class="gh-button__icon"></span>
                  Sign in with GitHub
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="z-10 font-bold w-2/3 h-2/3 flex text-white text-6xl gap-6 flex-col justify-center items-center">
          <h2>Welcome to Swiper!</h2>
          <div className="flex flex-col justify-center items-center gap-1">
            <p className="text-3xl">
              A perfect place to find your coding partner.
            </p>
            <p className="text-3xl">Sign Up and get started right now!</p>
          </div>
        </div>

        {/* Black Overlay */}
        <div className="absolute w-full h-full bg-black bg-opacity-60  "></div>
      </div>
      <div className="w-full h-screen flex justify-evenly items-center bg-white bg-opacity-90 z-10">
        {/* Conenctions Card */}

        <div className="w-1/4 h-2/3 flex flex-col justify-between items-center p-4 border-2 shadow-sm shadow-black border-black rounded-md">
          <h2 className="text-3xl">Connections</h2>
          <div className="w-full h-4/5 flex justify-start text-lg  items-start">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              eius a! Illum blanditiis dolore error molestiae nostrum quos.
              Reiciendis assumenda iure et odit quaerat vitae, quia, corrupti
              odio libero ab voluptatibus. Minima molestias illum consequatur
              reprehenderit, fuga harum ad sint minus labore doloremque? Dolore
              nulla cum natus, minima commodi voluptatibus.
            </p>
          </div>
        </div>

        {/* Projects Card */}

        <div className="w-1/4 h-2/3 flex flex-col justify-between items-center p-4 border-2 shadow-sm shadow-black border-black rounded-md">
          <h2 className="text-3xl">Projects</h2>
          <div className="w-full h-4/5 flex justify-start text-lg  items-start">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              eius a! Illum blanditiis dolore error molestiae nostrum quos.
              Reiciendis assumenda iure et odit quaerat vitae, quia, corrupti
              odio libero ab voluptatibus. Minima molestias illum consequatur
              reprehenderit, fuga harum ad sint minus labore doloremque? Dolore
              nulla cum natus, minima commodi voluptatibus.
            </p>
          </div>
        </div>

        {/* Mentoring Card */}
        <div className="w-1/4 h-2/3 flex flex-col justify-between items-center p-4 border-2 shadow-sm shadow-black border-black rounded-md">
          <h2 className="text-3xl">Mentoring</h2>
          <div className="w-full h-4/5 flex justify-start text-lg  items-start">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
              eius a! Illum blanditiis dolore error molestiae nostrum quos.
              Reiciendis assumenda iure et odit quaerat vitae, quia, corrupti
              odio libero ab voluptatibus. Minima molestias illum consequatur
              reprehenderit, fuga harum ad sint minus labore doloremque? Dolore
              nulla cum natus, minima commodi voluptatibus.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
