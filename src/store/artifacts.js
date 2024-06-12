import config from 'config'
import { unsetPortfolioArtifact } from './portfolios'

const SET_ARTIFACTS = 'SET_ARTIFACTS'
const SET_ARTIFACT = 'SET_ARTIFACT'
const REMOVE_ARTIFACT = 'REMOVE_ARTIFACT'

export const setArtifacts = artifacts => ({
  type: SET_ARTIFACTS,
  artifacts
})

export const setArtifact = artifact => ({
  type: SET_ARTIFACT,
  artifact
})

export const removeArtifact = artifact => ({
  type: REMOVE_ARTIFACT,
  artifact
})

export const artifacts = (state = null, action) => {
  const oldState = (state || {})

  switch (action.type) {
    case SET_ARTIFACTS:
      return action.artifacts

    case SET_ARTIFACT:
      oldState[action.artifact.id] = action.artifact
      return {...oldState}

    case REMOVE_ARTIFACT:
      if (action.artifact.id in oldState) {
        delete oldState[action.artifact.id]
      }

      return {...oldState}

    default:
      return state
  }
}

export const fetchArtifacts = () => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/artifacts'

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
  dispatch(setArtifacts(json))
}

export const fetchArtifact = (id) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/artifacts/' + id

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
  dispatch(setArtifact(json))
}

export const editArtifact = (artifact) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/artifacts/' + artifact.id

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify({
      responses: artifact.responses,
      parkingLot: artifact.parkingLot,
    }),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  window.alert("Successfully edited artifact")
  const json = await response.json()
  const portfolioId = json.portfolio.id

  window.location = '/my-portfolios/' + portfolioId + '/artifacts/' + artifact.id
}

export const deleteArtifact = (artifact) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/artifacts/' + artifact.id

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  window.alert("Successfully deleted artifact")
  const json = await response.json()
  dispatch(removeArtifact(json))
  dispatch(unsetPortfolioArtifact(json.id, json.portfolio.id))
  return
}

export const createArtifact = (portfolio) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/portfolios/' + portfolio.id + '/artifacts/responses/'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify({
      structure: portfolio.structure,
      responses: {},
      parkingLot: true,
    }),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  const json = await response.json()
  dispatch(setArtifacts({ newArtifactId: json.id }))
}
