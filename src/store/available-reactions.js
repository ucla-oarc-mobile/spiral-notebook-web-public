import config from 'config'

const SET_REACTIONS = 'SET_REACTIONS'

export const setAvailableReactions = availableReactions => ({
  type: SET_REACTIONS,
  availableReactions
})

export const availableReactions = (state = null, action) => {
  switch (action.type) {
    case SET_REACTIONS:
      const newState = (action.availableReactions || state || [])
      return [].concat(newState)

    default:
      return state
  }
}

export const fetchAvailableReactions = () => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/reactions/available'

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
  dispatch(setAvailableReactions(json))
}
