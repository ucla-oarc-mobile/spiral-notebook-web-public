import config from 'config'
import { fetchSharedPortfolio } from './shared-portfolios'
import { setSharedPortfolioMember } from './shared-portfolio-members'

const SET_INVITATIONS = 'SET_INVITATIONS'
const SET_INVITATION = 'SET_INVITATION'
const REMOVE_INVITATION = 'REMOVE_INVITATION'

export const setInvitations = invitations => ({
  type: SET_INVITATIONS,
  invitations,
})

export const setInvitation = invitation => ({
  type: SET_INVITATION,
  invitation
})

export const removeInvitation = invitation => ({
  type: REMOVE_INVITATION,
  invitation
})

export const invitations = (state = null, action) => {
  const oldState = (state || {})

  switch (action.type) {
    case SET_INVITATION:
      oldState[action.invitation.id] = action.invitation
      return {...oldState}

    case SET_INVITATIONS:
      return action.invitations

    case REMOVE_INVITATION:
      if (oldState && oldState[action.invitation.id]) {
        delete oldState[action.invitation.id]
      }

      return {...oldState}

    default:
      return state
  }
}

export const fetchInvitations = () => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/invitations'

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
  dispatch(setInvitations(json))
}

export const fetchInvitation = (pId) => async (dispatch, state) => {
  const user = state().user
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/invitations/' + pId

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
  dispatch(setInvitation(json, user))
  dispatch(fetchSharedPortfolio(json.sharedPortfolio.id))
}

export const createInvitation = (reciever, pId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/invitations'

  let content = {
    to: reciever,
    sharedPortfolio: pId,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify(content),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  const json = await response.json()
  dispatch(setInvitation(json))
}

export const deleteInvitation = (invId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/invitations/' + invId

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

  const json = await response.json()
  dispatch(removeInvitation(json))
}

export const acceptInvitation = (invId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/invitations/' + invId + '/accept'

   const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  const json = await response.json()
  dispatch(removeInvitation(json))
}

export const createNewUserInvitation = (recieverEmail, pId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/invitations'

  let content = {
    email: recieverEmail,
    sharedPortfolio: pId,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify(content),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  const json = await response.json()
  dispatch(setSharedPortfolioMember(json))
}
