import config from 'config'
import toaster from 'toaster'

const SET_USERS = 'SET_USERS'
const SET_OTHER_USER = 'SET_OTHER_USER'
const SET_OTHER_USER_PROCESSING = 'SET_OTHER_USER_PROCESSING'

export const setUsers = users => ({
  type: SET_USERS,
  users
})

export const setOtherUser = user => ({
  type: SET_OTHER_USER,
  user
})

export const setOtherUserProcessing = userId => ({
  type: SET_OTHER_USER_PROCESSING,
  userId
})

export const users = (state = null, action) => {
  switch (action.type) {
    case SET_USERS:
      return action.users

    case SET_OTHER_USER:
      return state.map(user => (
        user.id === action.user.id ? action.user : user
      ))

    case SET_OTHER_USER_PROCESSING:
      return state.map(user => (
        user.id === action.userId ? { ...user, blocked: null } : user
      ))

    default:
      return state
  }
}

export const fetchTeachers = () => async (dispatch, state) => {
  const url = config.api.baseUrl + '/users?role_ne=4'
  const jwt = state().session.jwt

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt
    }
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  const json = await response.json()
  dispatch(setUsers(json))
}

export const fetchUsers = () => async (dispatch, state) => {
  const url = config.api.baseUrl + '/users'
  const jwt = state().session.jwt

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt
    }
  })

  if (!response.ok) {
    // Special case for forbidden response, just return an empty array
    if (response.status === 403) {
      dispatch(setUsers([]))
      return
    }

    else {
      window.alert(await response.text())
      return
    }
  }

  const json = await response.json()
  dispatch(setUsers(json))
}

export const createUser = (email, username, roleId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/invitations/outside'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify({
      email,
      username,
      roleId
    }),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return false
  }

  const json = await response.json()
  dispatch(setOtherUser(json))

  toaster.show({
    message: 'User ' + username + ' successfully created.'
  })

  return true
}

export const setUserActive = (id, active) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/users/' + id

  dispatch(setOtherUserProcessing(id))

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify({
      blocked: !active,
    }),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  const json = await response.json()
  dispatch(setOtherUser(json))
}
