import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class Root extends React.Component {
  render() {
    let path = '/home'

    if (this.props.session.jwt) {
      path = this.props.session.origin || '/dashboard'
    }

    return (
      <Redirect to={path} />
    )
  }
}

const mapStateToProps = state => ({
  session: state.session
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Root)
