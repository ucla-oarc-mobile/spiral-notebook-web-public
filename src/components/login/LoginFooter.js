import React from 'react'

import 'styles/Login.css'

class LoginFooter extends React.Component {
  render() {
    return <div className="login-footer">
      <img
        className="nsf"
        src={process.env.PUBLIC_URL + '/images/nsf-logo@2x.png'}
        alt="National Science Foundation"
      />
      <img
        className="ucla"
        src={process.env.PUBLIC_URL + '/images/ucla-logo@2x.png'}
        alt="UCLA"
      />
      <img
        className="nd"
        src={process.env.PUBLIC_URL + '/images/nd-logo@2x.png'}
        alt="University of Notre Dame"
      />
    </div>
  }
}

export default LoginFooter
