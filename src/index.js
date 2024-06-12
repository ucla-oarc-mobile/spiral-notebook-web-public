import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from 'App'
import store from 'store'
import reportWebVitals from 'reportWebVitals'

import 'index.css'

// TODO: wrap <App /> in <React.StrictMode>

const provider = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(provider, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
