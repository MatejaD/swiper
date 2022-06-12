import { db } from "../firebaseConfig"
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function Home({ getArray }) {
  const dispatch = useDispatch()

  const array = useSelector((state) => state.array)
  const [count, setCount] = useState(0)
  const name = useSelector((state) => state.name)
  const id = useSelector((state) => state.id)
  const photo = useSelector((state) => state.photo)
  const userCollection = query(collection(db, "users"))
  const getingDocs = getDocs(userCollection)

  //   Chat

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [userChatting, setUserChatting] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [reset, setReset] = useState(false)
  const dummy = useRef()

  //   Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(1)

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage

  //

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"))
  }, [messages])

  useEffect(() => {
    // if (messages === null) {
    //   console.log("setting messages the first time")
    //   setMessages(snapShot.docs)
    // } else {
    //   console.log("updating messages")
    //   setMessages([...snapShot.docs, ...messages])
    // }
  }, [messages])

  const updateMessages = async (id) => {
    const q = query(collection(db, "messages"), orderBy("timestamp"))

    const usersDoc = await getDoc(doc(db, "users", id))
    const userData = doc(db, "users", localStorage.getItem("token"))
    let loggedInUserData = await getDoc(userData)
  }
  let newArray = array.slice(indexOfFirstRecord, indexOfLastRecord)

  const createChat = async (id) => {
    const usersDoc = await getDoc(doc(db, "users", id))
    const userData = doc(db, "users", localStorage.getItem("token"))
    let loggedInUserData = await getDoc(userData)

    setUserChatting({ ...usersDoc.data(), id: usersDoc.id })
    setIsChatOpen(true)

    // Messaging needs fixing
    // Ideas:
    // Create a document of messages and put all of the messages there
    // Place key of author and value of user that created the message
    // Add another key of who is receiving the messages
    // Map through all of the messages of that user thats sending
    // And find the ones that match with the user thats receiving
    const q = query(collection(db, "messages"), orderBy("timestamp"))

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      if (doc.data().sentTo === usersDoc.id) {
        if (doc.data().sentBy === loggedInUserData.id) {
          setMessages((oldArray) => [...oldArray, doc.data()])
        }
      }

      if (doc.data().sentTo === loggedInUserData.id) {
        if (doc.data().sentBy === usersDoc.id) {
          setMessages((oldArray) => [...oldArray, doc.data()])
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userData = doc(db, "users", localStorage.getItem("token"))
    let loggedInUserData = await getDoc(userData)
    if (inputValue) {
      //   User sending the message
      await addDoc(collection(db, "messages"), {
        message: inputValue,
        sentBy: loggedInUserData.id,
        sentTo: userChatting.id,
        timestamp: serverTimestamp(),
      })
      setMessages((oldArray) => [
        ...oldArray,
        {
          message: inputValue,
          sentBy: loggedInUserData.id,
          sentTo: userChatting.id,
          timestamp: serverTimestamp(),
        },
      ])

      const q = query(collection(db, "messages"), orderBy("timestamp"))

      const querySnapshot = getDocs(q)
      onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().sentTo === userChatting.id) {
            if (doc.data().sentBy === loggedInUserData.id) {
              setMessages((oldArray) => [...oldArray])
            }
          }
        })
      })

      //   querySnapshot.forEach((doc) => {
      //     if (doc.data().sentTo === userChatting.id) {
      //       console.log(doc.data().message)
      //       if (doc.data().sentBy === loggedInUserData.id) {
      //         setMessages((oldArray) => [...oldArray])
      //       }
      //     }
      //   })

      dummy.current?.scrollIntoView({ behavior: "smooth" })
      setInputValue("")
    }
  }

  return (
    <div className="flex justify-start items-center w-screen h-screen bg-green-500">
      <div className="h-full w-1/3 flex flex-col justify-center items-center gap-4 bg-blue-500">
        {isChatOpen ? (
          <div className="w-full h-full bg-red-400">
            {" "}
            <div className="w-full h-12 bg-blue-600 flex justify-start items-center px-4 gap-2">
              <img
                className="w-10 h-10 rounded-full z-50"
                src={userChatting.photo}
                alt=""
              />
              <p className="text-base">{userChatting.name}</p>{" "}
              <button
                onClick={() => {
                  setMessages([])
                  setIsChatOpen(false)
                }}
              >
                Back
              </button>
            </div>
            <div
              style={{ height: "75%" }}
              className="relative  w-full gap-2  overflow-y-auto bg-white"
            >
              {messages.length === 0 ? (
                <h2>Say hi!</h2>
              ) : (
                messages.map((msg) => {
                  return (
                    <div
                      style={{ minHeight: "1rem" }}
                      className={`w-full flex justify-start items-center ${
                        id === msg.sentBy ? "bg-blue-500" : "bg-red-500"
                      }`}
                    >
                      {msg.message}
                      {""}
                    </div>
                  )
                })
              )}
              <div className="w-full mt-10 bg-red-500" ref={dummy}></div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full h-36 px-8 flex justify-center items-center "
            >
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type..."
                className="w-full h-10 px-2 outline-none rounded-sm"
                type="text"
              />
            </form>
          </div>
        ) : (
          array.map((item) => {
            return (
              <div
                onClick={() => {
                  updateMessages(item.id)
                  createChat(item.id)
                }}
                className="w-full h-10 flex justify-start items-center bg-slate-100 text-black"
              >
                <h2>{item.name}</h2>
              </div>
            )
          })
        )}
      </div>
      <div className="w-3/5 h-full flex justify-center items-center gap-5 border-4 border-purple-500">
        <div className="w-full h-full flex flex-col relative">
          {newArray.length === 0 ? (
            <h1>No more Profiles :=</h1>
          ) : (
            newArray.map((item) => {
              console.log(array)
              return (
                <div
                  style={{ backgroundImage: `url(${item.photo})` }}
                  className="sliding-img bg-white absolute w-full h-full flex justify-center items-center gap-10"
                >
                  {item.name}{" "}
                  <button onClick={() => setCurrentPage(currentPage + 1)}>
                    NEXT
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
