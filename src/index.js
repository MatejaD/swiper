import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { Provider } from "react-redux"
import { createStore } from "redux"

const reducer = (state, action) => {
  if (action.type === "SET_NAME") {
    return { ...state, name: action.payload }
  }
  return state
}

const initalState = {
  name: "Name",
}

let store = createStore(reducer, initalState)

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)
