import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { Provider } from "react-redux"
import { createStore } from "redux"
import { BrowserRouter } from "react-router-dom"
import { act } from "react-dom/test-utils"

const reducer = (state, action) => {
  if (action.type === "SET_USER") {
    return {
      ...state,
      name: action.name,
      email: action.email,
      photo: action.photo,
    }
  }
  if (action.type === "LOADING_TRUE") {
    return { ...state, isLoading: true }
  }
  if (action.type === "LOADING_FALSE") {
    return { ...state, isLoading: false }
  }
  if (action.type === "ADD_DOCS") {
    return { ...state, array: state.array.concat(action.payload) }
  }
  return state
}

const initalState = {
  name: "Name",
  isLoading: false,
  array: [],
}

let store = createStore(reducer, initalState)

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </BrowserRouter>
)
