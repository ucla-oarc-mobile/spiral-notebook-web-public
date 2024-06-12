import React from 'react'
import { connect } from 'react-redux'
import { H1 } from '@blueprintjs/core'

import { logout } from 'store/session'
import { fetchUser } from 'store/user'
import Header from 'components/Header'
import LoginFooter from 'components/login/LoginFooter'
import Footer from 'components/Footer'

import 'styles/Home.css'
import logoTitle from 'images/spiral-notebook-logo@2x.png'
import aboutImg from 'images/spiral-notebook-img@2x.png'
import googlePlayImg from 'images/GoogleBadge.svg'
import appleStoreImg from 'images/AppleBadge.svg'

class Home extends React.Component {
  componentDidMount() {
    // Fetch user info if we don't have it yet
    if (this.props.session.jwt && !this.props.user) {
      this.props.fetchUser()
    }
  }

  render() {
    return <React.Fragment>
      <Header
        user={this.props.user}
        path="/home"
        onLogout={this.props.logout}
      />

      <div className="eq-page eq-about">
        <div role="main" id="main-content" className="content about">
          <div className="about-wrapper">
            <div className="about-flex">
              <div className="left">
                <H1>
                  <img
                    src={logoTitle}
                    alt="Spiral Notebook"
                  />
                </H1>
                <p className="large-text">Collect, annotate, review and
                  collaborate around authentic multimedia evidence of
                  instruction.</p>
                <div className="about-app">
                  <a
                    href='https://apps.apple.com/us/app/spiral-notebook/id1593721806'
                  >
                    <img className="apple"
                      alt='Get it on Google Play' src={appleStoreImg}/>
                  </a>
                  <a
                    href='https://play.google.com/store/apps/details?id=edu.ucla.spiral_notebook'
                  >
                    <img className="google"
                      alt='Get it on Google Play' src={googlePlayImg}/>
                  </a>
                </div>
              </div>
              <div className="right">
                <div className="about-image">
                  <img
                  src={aboutImg}
                    alt="3 screenshots of the mobile app"
                  />
                </div>
              </div>
            </div>
            <div className="eq-about-footer">
              <LoginFooter />
              <p className="inquiries"
              >For research inquiries and principle investigators contact:&nbsp;
                <a href="mailto:jfmtz@g.ucla.edu">
                  jfmtz@g.ucla.edu</a> and&nbsp;
                <a href="mailto:mkloser@nd.edu">
                  mkloser@nd.edu</a>
              </p>
              <p className="technical"
              >For technical support contact:&nbsp;
                <a href="mailto:mobilizelabs@oarc.ucla.edu">
                  mobilizelabs@oarc.ucla.edu
                </a>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)
