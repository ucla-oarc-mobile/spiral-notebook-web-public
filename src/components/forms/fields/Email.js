import React from 'react'
import PropTypes from 'prop-types'
import Textfield from 'components/Textfield'

class Email extends React.Component {
  render() {
    return <Textfield
      type = 'email'
      name = {this.props.name}
      label = {this.props.label}
      placeholder = {this.props.placeholder ?? ""}
      onChange = {this.props.onChange}
      required = {this.props.required === true}
      defaultValue = {this.props.defaultValue ?? ""}
      error = {this.props.error}
      className = "eq-email"
    />
  }
}

Email.validateField = (field, required) => {
  if (!field.type || field.type !== 'email') {
    return false
  }

  if (required && !field.value) {
    field.error = (<div>
      Field <strong>{field.text}</strong> is required.
    </div>)
    return false
  }

  let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/g
  if (!field.value.match(emailPattern)) {
    field.error = (<div>
      Field <strong>{field.text}</strong> is not a valid email address.
    </div>)
    return false
  }

  return true
}

Email.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
}

export default Email
