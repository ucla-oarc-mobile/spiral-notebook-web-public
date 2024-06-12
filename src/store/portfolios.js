import config from 'config'
import { setRedirect } from 'store/session'

const SET_PORTFOLIOS = 'SET_PORTFOLIOS'
const SET_PORTFOLIO = 'SET_PORTFOLIO'
const UNSET_PORTFOLIO_ARTIFACT = 'UNSET_PORTFOLIO_ARTIFACT'

export const setPortfolios = portfolios => ({
  type: SET_PORTFOLIOS,
  portfolios
})

export const setPortfolio = portfolio => ({
  type: SET_PORTFOLIO,
  portfolio
})

export const unsetPortfolioArtifact = (artifactId, portfolioId) => ({
  type: UNSET_PORTFOLIO_ARTIFACT,
  artifactId,
  portfolioId
})

export const portfolios = (state = null, action) => {
  switch (action.type) {
    case SET_PORTFOLIOS:
      return action.portfolios

    case SET_PORTFOLIO:
      // In case this portfolio was already cached, remove it first
      const oldState = (state || []).filter(portfolio => (
        portfolio.id !== action.portfolio.id
      ))
      return oldState.concat(action.portfolio)

    case UNSET_PORTFOLIO_ARTIFACT:
      const portfolios = (state || []).map(portfolio => {
        if (portfolio.id === action.portfolioId) {
          portfolio.artifacts = portfolio.artifacts.filter(
            artifact => artifact.id !== action.artifactId
          )
        }

        return portfolio
      })
      return [].concat(portfolios)

    default:
      return state
  }
}

export const fetchMyPortfolios = () => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/portfolios'

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
  dispatch(setPortfolios(json))
}

export const fetchUserPortfolios = (userId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/portfolios?owner=' + userId

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
  dispatch(setPortfolios(json))
}


export const fetchPortfolio = (id) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/portfolios/' + id

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
  dispatch(setPortfolio(json))
}

export const createPortfolio = (portfolio) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/portfolios'

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
  dispatch(setPortfolio(json))
}

export const updatePortfolio = (id, portfolio) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/portfolios/' + id

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
  dispatch(setPortfolio(json))
  dispatch(setRedirect('/my-portfolios/' + id))
}

export const deletePortfolio = (id) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/portfolios/' + id

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

  dispatch(setRedirect('/my-portfolios'))
}

export const clearPortfolios = () => async (dispatch, state) => {
  dispatch(setPortfolios([]))
}
