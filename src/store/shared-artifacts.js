import config from 'config'
import { setRedirect } from './session'
import { unsetSharedPortfolioSharedArtifact } from './shared-portfolios'

const SET_SHARED_ARTIFACT = 'SET_SHARED_ARTIFACT'
const SET_UNSAFE_SHARED_ARTIFACT = 'SET_UNSAFE_SHARED_ARTIFACT'
const REMOVE_SHARED_ARTIFACT = 'REMOVE_SHARED_ARTIFACT'
const REMOVE_UNSAFE_SHARED_ARTIFACT = 'REMOVE_UNSAFE_SHARED_ARTIFACT'
const SET_SHARED_ARTIFACT_NEW_COMMENT = 'SET_SHARED_ARTIFACT_NEW_COMMENT'
const SET_SHARED_ARTIFACT_EDIT_COMMENT = 'SET_SHARED_ARTIFACT_EDIT_COMMENT'
const SET_SHARED_ARTIFACT_DELETE_COMMENT = 'SET_SHARED_ARTIFACT_DELETE_COMMENT'
const ADD_SHARED_ARTIFACT_REACTION = 'ADD_SHARED_ARTIFACT_REACTION'
const REMOVE_SHARED_ARTIFACT_REACTION = 'REMOVE_SHARED_ARTIFACT_REACTION'

export const setSharedArtifact = sharedArtifact => ({
  type: SET_SHARED_ARTIFACT,
  sharedArtifact
})

export const setUnsafeSharedArtifact = sharedArtifact => ({
  type: SET_UNSAFE_SHARED_ARTIFACT,
  sharedArtifact
})

export const removeSharedArtifact = sharedArtifact => ({
  type: REMOVE_SHARED_ARTIFACT,
  sharedArtifact
})

export const removeUnsafeSharedArtifact = () => ({
  type: REMOVE_UNSAFE_SHARED_ARTIFACT,
})

export const setSharedArtifactEditComment = (comment) => ({
  type: SET_SHARED_ARTIFACT_EDIT_COMMENT,
  comment
})

export const setSharedArtifactNewComment = (comment, user) => ({
  type: SET_SHARED_ARTIFACT_NEW_COMMENT,
  comment,
  user
})

export const setSharedArtifactDeleteComment = (comment) => ({
  type: SET_SHARED_ARTIFACT_DELETE_COMMENT,
  comment
})

export const addSharedArtifactReaction = (reaction) => ({
  type: ADD_SHARED_ARTIFACT_REACTION,
  reaction
})

export const removeSharedArtifactReaction = (reaction) => ({
  type: REMOVE_SHARED_ARTIFACT_REACTION,
  reaction
})

export const sharedArtifacts = (state = null, action) => {
  const oldState = (state || {})
  const oldSharedArtifacts = (state || {})
  var aId = null

  switch (action.type) {
    case SET_SHARED_ARTIFACT:
      oldState[action.sharedArtifact.id] = action.sharedArtifact
      return {...oldState}

    case SET_UNSAFE_SHARED_ARTIFACT:
      return {
        ...oldState,
        unsafe: action.sharedArtifact,
      }

    case SET_SHARED_ARTIFACT_NEW_COMMENT:
      aId = action.comment.sharedArtifact.id
      if (oldSharedArtifacts[aId]) {
        // Todo, at some point this might not be needed.
        action.comment.owner = action.comment.owner.id
        oldSharedArtifacts[aId].comments.push(action.comment)
      }

      if (!action.comment.username) {
        action.comment.username = action.user.username
      }

      return {...oldSharedArtifacts}

    case REMOVE_SHARED_ARTIFACT:
      delete oldState[action.sharedArtifact.id]
      return {...oldState}

    case REMOVE_UNSAFE_SHARED_ARTIFACT:
      delete oldState.unsafe
      return {...oldState}

    case SET_SHARED_ARTIFACT_EDIT_COMMENT:
      aId = action.comment.sharedArtifact.id
      if (oldSharedArtifacts[aId]) {
        oldSharedArtifacts[aId].comments = oldSharedArtifacts[aId].comments.map(comment => {
          if (comment.id === action.comment.id){
            // Todo, at some point this might not be needed.
            action.comment.owner = action.comment.owner.id
            return action.comment
          }
          return comment
        })
      }

      return {...oldSharedArtifacts}

    case SET_SHARED_ARTIFACT_DELETE_COMMENT:
      aId = action.comment.sharedArtifact.id
      if (oldSharedArtifacts[aId]) {
        oldSharedArtifacts[aId].comments = oldSharedArtifacts[aId].comments.filter(comment => {
          if (comment.id === action.comment.id){
            return false
          }
          return true
        })
      }

      return {...oldSharedArtifacts}

    case ADD_SHARED_ARTIFACT_REACTION:
      aId = action.reaction.sharedArtifact.id
      action.reaction.owner = action.reaction.owner.id
      oldSharedArtifacts[aId].reactions.push(action.reaction)
      return {...oldSharedArtifacts}

    case REMOVE_SHARED_ARTIFACT_REACTION:
      aId = action.reaction.sharedArtifact.id
      oldSharedArtifacts[aId].reactions = oldSharedArtifacts[aId].reactions.filter(x => {
        return x.id !== action.reaction.id
      })

      return {...oldSharedArtifacts}

    default:
      return state
  }
}

export const fetchSharedArtifact = (aId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-artifacts/' + aId

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
  dispatch(setSharedArtifact(json))
}

export const gateCheckSharedArtifact = (sharedPortfolioId, artifact, updatedAt) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-portfolios/' + sharedPortfolioId + '/shared-artifacts/' + artifact.id + '/gate-check?updated_at=' + updatedAt

  const response = await fetch(url, {
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

  if (json.type === 'error') {
    window.alert(json.message)
    return
  }

  else if (json.type === 'ok') {
    dispatch(editSharedArtifact(sharedPortfolioId, artifact))
  }

  else {
    dispatch(setUnsafeSharedArtifact({
      ...artifact,
      warning: json.message,
    }))
  }
}

export const editSharedArtifact = (sharedPortfolioId, artifact) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-artifacts/' + artifact.id

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    },
    body: JSON.stringify(artifact),
  })

  if (!response.ok) {
    window.alert(await response.text())
    return
  }

  window.alert("Successfully edited shared artifact")
  window.location = '/shared-portfolios/' + sharedPortfolioId + '/artifacts/' + artifact.id
}

export const deleteSharedArtifact = (artifact) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/shared-artifacts/' + artifact.id

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

  window.alert("Successfully deleted shared artifact")
  const json = await response.json()
  dispatch(removeSharedArtifact(json))
  dispatch(unsetSharedPortfolioSharedArtifact(json.id, json.sharedPortfolio.id))
  return
}

export const createComment = (aId, comment) => async (dispatch, state) => {
  const user = state().user
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/comments'

  let content = {
    text: comment,
    owner: user.id,
    sharedArtifact: aId,
    updated_by: user.id
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
  dispatch(setSharedArtifactNewComment(json, user))
}

export const editComment = (pId, aId, cId, comment) => async (dispatch, state) => {
  const user = state().user
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/comments/' + cId

  let content = {
    text: comment,
    owner: user.id,
    sharedArtifact: aId,
    updated_by: user.id
  }

  const response = await fetch(url, {
    method: 'PUT',
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
  dispatch(setSharedArtifactEditComment(json))
}

export const deleteComment = (cId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/comments/' + cId

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

  window.alert("Successfully deleted comment")
  const json = await response.json()
  dispatch(setSharedArtifactDeleteComment(json))
}

export const addReaction  = (aId, reaction) => async (dispatch, state) => {
  const user = state().user
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/reactions'

  let content = {
    sharedArtifact: aId,
    owner: user.id,
    value: reaction,
    created_by: user.id,
    updated_by: user.id
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
  dispatch(addSharedArtifactReaction(json))
}

export const deleteReaction = (reactionId) => async (dispatch, state) => {
  const jwt = state().session.jwt
  const url = config.api.baseUrl + '/reactions/' + reactionId

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
  dispatch(removeSharedArtifactReaction(json))
}

export const copyArtifact = (sharedPortfolioId, aId, shared) => async (dispatch, state) => {
  dispatch(setRedirect(null))

  const jwt = state().session.jwt
  let url = config.api.baseUrl + '/'
  if (shared) {
    url += 'shared-'
  }
  url += 'artifacts/' + aId + '/share'

  let content = {
    sharedPortfolioId: sharedPortfolioId
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
    dispatch(setRedirect('ERROR'))
    return
  }

  window.alert("Successfully copied artifact")
  const json = await response.json()
  dispatch(setSharedArtifact(json))
  dispatch(setRedirect('/shared-portfolios/' + sharedPortfolioId + '/artifacts/' + json.id + '/edit'))
  return
}
