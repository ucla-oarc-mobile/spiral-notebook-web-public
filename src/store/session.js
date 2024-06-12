import Cookies from 'universal-cookie'

import config from 'config'
import { setUser } from 'store/user'

const SET_JWT = 'SET_JWT'
const SET_ORIGIN = 'SET_ORIGIN'
const SET_REDIRECT = 'SET_REDIRECT'
const SET_RELOAD = 'SET_RELOAD'

export const setJwt = jwt => ({
  type: SET_JWT,
  jwt
})

export const setOrigin = path => ({
  type: SET_ORIGIN,
  origin: path
})

export const setRedirect = path => ({
  type: SET_REDIRECT,
  redirect: path
})

export const setReload = flag => ({
  type: SET_RELOAD,
  reload: flag
})

export const session = (state = {}, action) => {
  switch (action.type) {
    case SET_JWT:
      return {
        ...state,
        jwt: action.jwt
      }

    case SET_ORIGIN:
      return {
        ...state,
        origin: action.origin
      }

    case SET_REDIRECT:
      return {
        ...state,
        redirect: action.redirect
      }

    case SET_RELOAD:
      return {
        ...state,
        reload: action.reload
      }

    default:
      return state
  }
}

export const login = (email, password) => async (dispatch, state) => {
  const url = config.api.baseUrl + '/auth/local'
  const params = {
    identifier: email,
    password
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    window.alert('Incorrect email or password.')
    return
  }

  const json = await response.json()

  dispatch(setJwt(json.jwt))
  dispatch(setUser(json.user))

  const cookies = new Cookies()
  cookies.set('jwt', json.jwt)
}

export const logout = () => (dispatch, state) => {
  const cookies = new Cookies()

  // With the cookie cleared, easiest way to reset state is a reload
  cookies.addChangeListener(() => {
    window.location = '/'
  })
  cookies.remove('jwt')
}

export const forgotPassword = (email) => async (dispatch, state) => {
  const url = config.api.baseUrl + '/auth/forgot-password'
  const params = {
    email
  }

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })

  window.alert('If your email was valid, a reset password link will be sent to it.')

  dispatch(setRedirect('/login'))
}

export const resetPassword = (code, password, passwordConfirmation) => async (dispatch, state) => {
  const url = config.api.baseUrl + '/auth/reset-password'
  const params = {
    code,
    password,
    passwordConfirmation
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })

  const json = await response.json()

  if (!response.ok) {
    window.alert(json.message[0].messages[0].message)
    return
  }

  window.alert('Your password has been changed and you have been logged in.')

  dispatch(setJwt(json.jwt))
  dispatch(setUser(json.user))

  const cookies = new Cookies()
  cookies.set('jwt', json.jwt)
}

export const shouldReload = (flag) => async (dispatch) => {
  dispatch(setReload(flag))
}
