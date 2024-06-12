import React from 'react'
import { connect } from 'react-redux'
import {
  H1,
  Button
} from '@blueprintjs/core'
import { Link, Redirect } from 'react-router-dom'

import 'styles/buttons.css'
import { resetPassword } from 'store/session'
import LoginHeader from 'components/login/LoginHeader'
import LoginFooter from 'components/login/LoginFooter'
import Textfield from 'components/Textfield'
import Footer from 'components/Footer'
import SkipLinks from 'components/Skiplinks'

class ResetPassword extends React.Component {
  constructor() {
    super()

    this.state = {
      password: '',
      passwordConfirmation: '',
    }
  }

  submit = (event) => {
    event.preventDefault()

    this.props.resetPassword(
      this.props.match.params.code,
      this.state.password,
      this.state.passwordConfirmation
    )
  }

  render() {
    if (this.props.session.jwt) {
      const path = this.props.session.origin || '/'

      return (
        <Redirect to={path} />
      )
    }

    return <div className="eq-page login-page">
      <header><SkipLinks contentId="#login" /></header>
      <div className="login-wrapper" role="main">
        <div id="login" className="login-block">
          <LoginHeader />
          <div className="login-body">
            <div className="login-form">
              <H1 className="eq-title-block">Reset Password</H1>
              <form onSubmit={this.submit}>
                {this.renderPasswordInput()}
                {this.renderConfirmPasswordInput()}
                {this.renderSubmitButton()}
                {this.renderBackToLogin()}
              </form>
            </div>
          </div>
          <LoginFooter />
        </div>
      </div>
      <Footer />
    </div>
  }

  renderPasswordInput() {
    return <Textfield
      type="password"
      name="password"
      label="New Password"
      placeholder="Enter Password"
      required
      onChange={this.changeInput}
    />
  }

  renderConfirmPasswordInput() {
    return <Textfield
      type="password"
      name="passwordConfirmation"
      label="Confirm New Password"
      placeholder="Enter Password"
      required
      onChange={this.changeInput}
    />
  }

  renderBackToLogin() {
    return (
      <div style={{textAlign: 'center'}}>
        <Link to="/login">
          BACK TO LOGIN
        </Link>
      </div>
    )
  }

  renderSubmitButton() {
    return (
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-inverted"
        style={{margin: '40px 0 20px'}}
        type="submit"
      >
        SUBMIT
      </Button>
    )
  }

  changeInput = (event) => {
    const name = event.currentTarget.name
    let val = event.currentTarget.value
    let newState = {}

    newState[name] = val
    this.setState(newState)
  }
}

const mapStateToProps = state => ({
  session: state.session
})

const mapDispatchToProps = dispatch => ({
  resetPassword: (code, password, passwordConfirmation) => dispatch(
    resetPassword(code, password, passwordConfirmation)
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
