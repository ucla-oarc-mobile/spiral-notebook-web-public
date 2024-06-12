import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import 'styles/Footer.css'

class Footer extends React.Component {
  render() {
    let giveFeedBack = null
    if (this.props.session.jwt) {
      giveFeedBack = <span>
        <a
          href="http://tinyurl.com/3r399ja5"
          target="_blank"
          rel="noreferrer"
          className="eq-button link-button eq-button-inverted"
        >
          Give Feedback
        </a>
      </span>
    }

    return (
      <footer className="eq-footer">
        &copy; 2022 UC Regents. All Rights Reseved. |&nbsp;

        <Link to="/privacy">
          Privacy Policy
        </Link>
        &nbsp;|&nbsp;
        <Link to="/home">
          Home
        </Link>
        &nbsp;|&nbsp;
        <a href="https://spiral-notebook-afb65c.webflow.io/">
          About
        </a>

        {giveFeedBack}
      </footer>
    )
  }
}

const mapStateToProps = state => ({
  session: state.session
})

export default connect(mapStateToProps)(Footer)
