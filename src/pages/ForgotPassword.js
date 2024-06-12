import React from 'react'
import { connect } from 'react-redux'
import {
  H1,
  Button
} from '@blueprintjs/core'
import { Link, Redirect } from 'react-router-dom'

import 'styles/buttons.css'
import { forgotPassword } from 'store/session'
import LoginHeader from 'components/login/LoginHeader'
import LoginFooter from 'components/login/LoginFooter'
import Textfield from 'components/Textfield'
import Footer from 'components/Footer'
import SkipLinks from 'components/Skiplinks'

class ForgotPassword extends React.Component {
  constructor() {
    super()

    this.state = {
      email: '',
    }
  }


  submit = (event) => {
    event.preventDefault()
    this.props.forgotPassword(this.state.email)
  }

  render() {
    if (this.props.session.redirect) {
      return (
        <Redirect to={this.props.session.redirect} />
      )
    }

    return <div className="eq-page login-page">
      <header><SkipLinks contentId="#login" /></header>
      <div className="login-wrapper" role="main">
        <div id="login" className="login-block">
          <LoginHeader />
          <div className="login-body">
            <div className="login-form">
              <H1 className="eq-title-block">Forgot Password</H1>
              <div style={{textAlign: 'center'}}><p>
                Enter your email address and we will send you instructions on how
                to create a new password.
              </p></div>
              <form onSubmit={this.submit}>
                {this.renderEmailInput()}
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
  forgotPassword: email => dispatch(forgotPassword(email))
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
