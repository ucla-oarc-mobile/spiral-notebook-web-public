import { combineReducers, createStore, applyMiddleware } from 'redux'
import Cookies from 'universal-cookie'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import { session } from 'store/session'
import { user } from 'store/user'
import { users } from 'store/users'
import { portfolios } from 'store/portfolios'
import { sharedPortfolios } from 'store/shared-portfolios'
import { artifacts } from 'store/artifacts'
import { sharedArtifacts } from 'store/shared-artifacts'
import { availableReactions } from 'store/available-reactions'
import { invitations } from 'store/invitations'
import { sharedPortfolioMembers } from 'store/shared-portfolio-members'

const cookies = new Cookies()
const jwt = cookies.get('jwt')
let initialState = {}

if (jwt) {
  initialState = {
    session: {
      jwt
    }
  }
}

const rootReducer = combineReducers({
  session,
  user,
  users,
  portfolios,
  sharedPortfolios,
  artifacts,
  sharedArtifacts,
  availableReactions,
  invitations,
  sharedPortfolioMembers,
})

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
