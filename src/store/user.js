import config from 'config'

const SET_USER = 'SET_USER'

export const setUser = user => ({
  type: SET_USER,
  user
})

export const user = (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.user

    default:
      return state
  }
}

export const fetchUser = () => async (dispatch, state) => {
  const url = config.api.baseUrl + '/users/me'
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
  dispatch(setUser(json))
}
