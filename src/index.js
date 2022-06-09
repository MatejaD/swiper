import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { Provider } from "react-redux"
import { createStore } from "redux"
import { BrowserRouter } from "react-router-dom"

const reducer = (state, action) => {
  if (action.type === "SET_NAME") {
    return { ...state, name: action.payload }
  }
  if (action.type === "LOADING_TRUE") {
    return { ...state, isLoading: true }
  }
  if (action.type === "LOADING_FALSE") {
    return { ...state, isLoading: false }
  }
  return state
}

const initalState = {
  name: "Name",
  isLoading: false,
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
