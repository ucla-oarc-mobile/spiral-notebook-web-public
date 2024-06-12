import React from 'react'
import { connect } from 'react-redux'
import { H1 } from '@blueprintjs/core'

import { logout } from 'store/session'
import { fetchUser } from 'store/user'
import Header from 'components/Header'
import Footer from 'components/Footer'

import 'styles/Home.css'

class Privacy extends React.Component {
  componentDidMount() {
    // Fetch user info if we don't have it yet
    if (this.props.session.jwt && !this.props.user) {
      this.props.fetchUser()
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header
          user={this.props.user}
          onLogout={this.props.logout}
        />

        <div className="eq-page eq-about">
          <div role="main" id="main-content" className="content about">
            <div className="about-wrapper" style={{ textAlign: 'left' }}>
              <H1 style={{ textAlign: 'center' }}>
                Privacy Policy
              </H1>
              <p>
                <strong>Spiral Project</strong> provides a mobile platform for educational research and productivity.
              </p>

              <p>
                <strong>"Personal Information"</strong> means information that alone or when in combination with other information may be used to readily identify, contact, or locate you. We do not share any of your data for commercial purposes.
              </p>

              <p>
                <strong>Spiral Project collects your information.</strong> We collect personal information when you register to use Spiral Project; use Spiral Project on your mobile device; and communicate with us. We also collect usage statistics.
              </p>

              <p>
                <strong>Personal Information Collection.</strong> You must register to use the Spiral Project app but will not enter your name as part of the registration.
              </p>

              <p>
                <strong>Using Spiral Project.</strong> We collect the information, including Personal Information, you enter into the app.
              </p>

              <p>
                <strong>Cookies, Automatic Data Collection, and Related
                Technologies.</strong> Spiral Project collects and stores information that is generated automatically as you use it, including your content and usage statistics. We will also know your mobile device ID (UDID/IMEI), or another unique identifier, and mobile operating system.
              </p>

              <p>
                <strong>Consent.</strong> By using this app you consent to our
                privacy policy.
              </p>

              <p>
                <strong>Changes to our Privacy Policy.</strong> If we decide to change our privacy policy, we will post the changes at this location, and we will note the date it was last modified. This policy was last modified on 11/1/21.
              </p>

              <p>
                <strong>Customer Support.</strong> Support is provided by the Spiral Notebook team. You can contact us via email at <a href="mailto:mobilizelabs@oarc.ucla.edu">
                  mobilizelabs@oarc.ucla.edu
                </a>.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  session: state.session,
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  fetchUser: () => dispatch(fetchUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Privacy)
