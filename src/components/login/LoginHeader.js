import React from 'react'

import 'styles/Login.css'

class LoginHeader extends React.Component {
  render() {
    return <div className="login-header">
      <img
        src={process.env.PUBLIC_URL + '/images/spiral-notebook-logo@2x.png'}
        alt="Spiral Notebook"
        style={{ width: '100%' }}
      />
    </div>
  }
}

export default LoginHeader
