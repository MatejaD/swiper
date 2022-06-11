import { async } from "@firebase/util"
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { db } from "../firebaseConfig"

export default function Home({ getArray }) {
  const dispatch = useDispatch()

  const array = useSelector((state) => state.array)
  const [count, setCount] = useState(0)
  const name = useSelector((state) => state.name)
  const photo = useSelector((state) => state.photo)
  const userCollection = query(collection(db, "users"))
  const getingDocs = getDocs(userCollection)

  //   Chat
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [userChatting, setUserChatting] = useState([])
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")

  //   Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(1)

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage

  useEffect(() => {
    const userData = doc(db, "users", localStorage.getItem("token"))
    onSnapshot(userData, (doc) => {})
  }, [])

  let newArray = array.slice(indexOfFirstRecord, indexOfLastRecord)
  console.log(newArray)

  const createChat = async (id) => {
    // Create a new doc in messages collection
    await addDoc(collection(db, "messages"), {
      chatStarted: serverTimestamp(),
    })

    const usersDoc = await getDoc(doc(db, "users", id))
    setUserChatting({ ...usersDoc.data(), id: usersDoc.id })
    setIsChatOpen(true)
    onSnapshot(doc(db, "users", userChatting.id), (doc) => {
      setMessages(doc.data().messages)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userData = doc(db, "users", localStorage.getItem("token"))
    if (inputValue) {
      // User sending the message
      await updateDoc(userData, {
        messages: arrayUnion({
          Message: inputValue,
          time: new Date().getTime(),
        }),
      })

      //   User receiving the message
      await updateDoc(doc(db, "users", userChatting.id), {
        messages: arrayUnion({
          Message: inputValue,
          time: new Date().getTime(),
        }),
      })
      onSnapshot(doc(db, "users", userChatting.id), (doc) => {
        setMessages(doc.data().messages)
      })
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
              <button onClick={() => setIsChatOpen(false)}>Back</button>
            </div>
            <div
              style={{ height: "75%" }}
              className="w-full  overflow-y-auto bg-white p-2"
            >
              {messages.length === 0 ? (
                <h2>Say hi!</h2>
              ) : (
                messages.map((msg) => {
                  return (
                    <div
                      style={{ minHeight: "3rem" }}
                      className="w-full flex justify-start items-center "
                    >
                      {msg.Message}
                      {""}
                    </div>
                  )
                })
              )}
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full h-1/6 px-8 flex justify-center items-center "
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
                onClick={() => createChat(item.id)}
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
