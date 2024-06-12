import config from 'config'

const SET_SHARED_PORTFOLIO_MEMBERS = 'SET_SHARED_PORTFOLIO_MEMBERS'
const SET_SHARED_PORTFOLIO_MEMBER = 'SET_SHARED_PORTFOLIO_MEMBER'
const UNSET_SHARED_PORTFOLIO_MEMBERS = 'UNSET_SHARED_PORTFOLIO_MEMBERS'
const REMOVE_SHARED_PORTFOLIO_MEMBER = 'REMOVE_SHARED_PORTFOLIO_MEMBER'
const REMOVE_SHARED_PORTFOLIO_PENDING = 'REMOVE_SHARED_PORTFOLIO_PENDING'

export const setSharedPortfolioMembers = members => ({
  type: SET_SHARED_PORTFOLIO_MEMBERS,
  members,
})

export const unsetSharedPortfolioMembers = () => ({
  type: UNSET_SHARED_PORTFOLIO_MEMBERS,
})

export const setSharedPortfolioMember = member => ({
  type: SET_SHARED_PORTFOLIO_MEMBER,
  member
})

export const unsetSharedPortfolioMember = (sharedPortfolio, removedMId) => ({
  type: REMOVE_SHARED_PORTFOLIO_MEMBER,
  sharedPortfolio,
  removedMId
})

export const unsetSharedPortfolioPending = member =>({
  type: REMOVE_SHARED_PORTFOLIO_PENDING,
  member,
})

export const sharedPortfolioMembers = (state = null, action) => {
  const oldState = (state || {})
  let mId = null
  let nonMember = null

  switch (action.type) {
    case SET_SHARED_PORTFOLIO_MEMBERS:
      return {...action.members}

    case UNSET_SHARED_PORTFOLIO_MEMBERS:
      return null

    case SET_SHARED_PORTFOLIO_MEMBER:
      mId = action.member.to?.id
      if (oldState.nonMembers) {
        oldState.nonMembers = oldState.nonMembers.filter(nonMember => {
          if (nonMember.id === mId) {
            return false
          } else {
            return true
          }
        })
      }

      let pendingInvite = {
        invitationId: action.member.id,
        pending: true,
        username: action.member.to.username,
        id: action.member.to.id,
        email: action.member.to.email,
      }


      if (!oldState.pending) {
        oldState.pending = []
      }
      oldState.pending.push(pendingInvite)

      return {...oldState}

    case REMOVE_SHARED_PORTFOLIO_PENDING:
      mId = action.member.to?.id

      if (oldState.pending) {
        oldState.pending = oldState.pending.filter(member => {
          if (member.id === mId) {
            nonMember = member

            if (nonMember.pending) {
              delete nonMember.pending
            }

            if (nonMember.invitationId) {
              delete nonMember.invitationId
            }

            return false
          } else {
            return true
          }
        })
      }

      if (!oldState.nonMembers) {
        oldState.nonMembers = []
      }
      oldState.nonMembers.push(nonMember)

      return {...oldState}

    case REMOVE_SHARED_PORTFOLIO_MEMBER:
      nonMember = null
      mId = action.removedMId

      if (oldState.members) {
        oldState.members = oldState.members.filter(member => {
          if (member.id === mId) {
            nonMember = member
            return false
          } else {
            return true
          }
        })
      }

      if (!oldState.nonMembers) {
        oldState.nonMembers = []
      }
      oldState.nonMembers.push(nonMember)

      return {...oldState}

    default:
      return state
  }
}

export const fetchSharedPortfolioMembers = (pId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios/' + pId + '/members'

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
  dispatch(setSharedPortfolioMembers(json))
}

export const destroySharedPortfolioMembers = () => async (dispatch) => {
  dispatch(unsetSharedPortfolioMembers)
}

export const inviteSharedPortfolioMember = (reciever, pId) => async (dispatch, state) => {
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
  dispatch(setSharedPortfolioMember(json))
}

export const removeSharedPortfolioMember = (pId, uId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios/' + pId + '/remove-user/' + uId

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
  dispatch(unsetSharedPortfolioMember(json, uId))
}

export const deleteSharedPortfolioPendingInvitation = (invId) => async (dispatch, state) => {
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
  dispatch(unsetSharedPortfolioPending(json))
}
