import React from 'react'
import { connect } from 'react-redux'
import {
  H1,
  Button
} from '@blueprintjs/core'
import { Link, Redirect } from 'react-router-dom'

import 'styles/buttons.css'
import { login, setRedirect } from 'store/session'
import LoginHeader from 'components/login/LoginHeader'
import LoginFooter from 'components/login/LoginFooter'
import Textfield from 'components/Textfield'
import Footer from 'components/Footer'
import SkipLinks from 'components/Skiplinks'

class Login extends React.Component {
  constructor() {
    super()

    this.state = {
      email: '',
      password: '',
    }
  }

  submit = (event) => {
    event.preventDefault()
    this.props.login(this.state.email, this.state.password)
  }

  componentDidMount() {
    // If user was redirected here then its job is done, so clear it
    if (this.props.session.redirect) {
      this.props.setRedirect(null)
    }
  }

  render() {
    if (this.props.session.jwt) {
      const path = this.props.session.origin || '/dashboard'

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
              <H1 className="eq-title-block">Login</H1>
              <form onSubmit={this.submit}>
                {this.renderEmailInput()}
                {this.renderPasswordInput()}
                {this.renderForgotPassword()}
                {this.renderSubmitButton()}
              </form>
            </div>
          </div>
          <LoginFooter />
        </div>
      </div>
      <Footer />
    </div>
  }

  renderEmailInput() {
    return <Textfield
      type = 'email'
      name = 'email'
      label = 'Email'
      placeholder = 'Enter Email'
      required
      onChange={this.changeInput}
    />
  }

  renderPasswordInput() {
    return <Textfield
      type = 'password'
      name = 'password'
      label = 'Password'
      placeholder = 'Enter Password'
      required
      onChange={this.changeInput}
    />
  }

  renderForgotPassword() {
    return (
      <div style={{textAlign: 'center'}}>
        <Link to="/forgot-password">
          Forgot your password?
        </Link>
      </div>
    )
  }

  renderSubmitButton() {
    return (
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-inverted"
        style={{margin: '40px 0'}}
        type="submit"
      >
        LOGIN
      </Button>
    )
  }

  // Setters/Getters
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
  login: (email, password) => dispatch(login(email, password)),
  setRedirect: path => dispatch(setRedirect(path))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
