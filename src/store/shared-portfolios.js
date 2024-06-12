import config from 'config'
import { setRedirect } from './session'

const SET_SHARED_PORTFOLIOS = 'SET_SHARED_PORTFOLIOS'
const SET_SHARED_PORTFOLIO = 'SET_SHARED_PORTFOLIO'
const UNSET_SHARED_PORTFOLIO = 'UNSET_SHARED_PORTFOLIO'
const UNSET_SHARED_PORTFOLIO_SHARED_ARTIFACT = 'UNSET_SHARED_PORTFOLIO_SHARED_ARTIFACT'

export const setSharedPortfolios = sharedPortfolios => ({
  type: SET_SHARED_PORTFOLIOS,
  sharedPortfolios,
})

export const setSharedPortfolio = sharedPortfolio => ({
  type: SET_SHARED_PORTFOLIO,
  sharedPortfolio
})

export const unsetSharedPortfolios = sharedPortfolio => ({
  type: UNSET_SHARED_PORTFOLIO,
  sharedPortfolio
})

export const unsetSharedPortfolioSharedArtifact = (sharedArtifactId, sharedPortfolioId) => ({
  type: UNSET_SHARED_PORTFOLIO_SHARED_ARTIFACT,
  sharedArtifactId,
  sharedPortfolioId
})

export const sharedPortfolios = (state = null, action) => {
  switch (action.type) {
    case SET_SHARED_PORTFOLIOS:
      return action.sharedPortfolios

    case SET_SHARED_PORTFOLIO:
      // In case this sharedPortfolio was already cached, remove it first
      const oldState = (state || []).filter(sharedPortfolio => (
        sharedPortfolio.id !== action.sharedPortfolio.id
      ))
      return oldState.concat(action.sharedPortfolio)

    case UNSET_SHARED_PORTFOLIO:
      return null

    case UNSET_SHARED_PORTFOLIO_SHARED_ARTIFACT:
      const sharedPortfolios = (state || []).map(sharedPortfolio => {
        if (sharedPortfolio.id === action.sharedPortfolioId) {
          sharedPortfolio.sharedArtifacts = sharedPortfolio.sharedArtifacts.filter(
            sharedArtifact => sharedArtifact.id !== action.sharedArtifactId
          )
        }

        return sharedPortfolio
      })
      return [].concat(sharedPortfolios)

    default:
      return state
  }
}

export const fetchSharedPortfolios = () => async (dispatch, state) => {
  const user = state().user
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios'

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
  dispatch(setSharedPortfolios(json, user))
  return Promise.resolve()
}

export const fetchSharedPortfolio = (pId) => async (dispatch, state) => {
  const user = state().user
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios/' + pId

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
  dispatch(setSharedPortfolio(json, user))
  return Promise.resolve()
}

export const destroySharedPortfolios = () => async (dispatch) => {
  dispatch(unsetSharedPortfolios)
}

export const leaveSharedPortfolio = (pId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios/' + pId + '/leave'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt
    }
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  dispatch(unsetSharedPortfolios)
  dispatch(setRedirect("/dashboard"))
}

export const createSharedPortfolio = (portfolio) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify({
      ...portfolio,
      name: portfolio.name.trim(),
    }),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  const json = await response.json()
  dispatch(setSharedPortfolio(json))
  dispatch(setRedirect('/shared-portfolios/' + json.id))
}

export const updateSharedPortfolio = (id, portfolio) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios/' + id

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify({
      ...portfolio,
      name: portfolio.name.trim(),
    }),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  const json = await response.json()
  dispatch(setSharedPortfolio(json))
  dispatch(setRedirect('/shared-portfolios/' + id))
}

export const deleteSharedPortfolio = (id) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios/' + id

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

  dispatch(setRedirect('/shared-portfolios'))
}
