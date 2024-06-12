import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import { logout, setOrigin } from 'store/session'
import { fetchUser } from 'store/user'
import Header from 'components/Header'
import Footer from 'components/Footer'

class PrivateRoute extends React.Component {
  componentDidMount() {
    // Fetch user info if we don't have it yet
    if (this.props.session.jwt && !this.props.user) {
      this.props.fetchUser()
    }
  }

  render() {
    if (!this.props.session.jwt) {
      // Remember the user's origin so they can get redirected back
      this.props.setOrigin(this.props.location.pathname)

      return (
        <Redirect to="/" />
      )
    }

    // Wait for user info if we don't have it yet
    else if (!this.props.user) {
      return null
    }

    else {
      return (
        <React.Fragment>
          <Header
            user={this.props.user}
            path={this.props.path}
            onLogout={this.props.logout}
          />

          <div className="content">
            <Route {...this.props} />
          </div>

          <Footer />
        </React.Fragment>
      )
    }
  }
}

const mapStateToProps = state => ({
  session: state.session,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  setOrigin: path => dispatch(setOrigin(path)),
  fetchUser: () => dispatch(fetchUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
