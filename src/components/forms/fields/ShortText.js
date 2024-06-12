import React from 'react'
import PropTypes from 'prop-types'
import 'styles/fields/ShortText.css'
import Textfield from 'components/Textfield'

class ShortText extends React.Component {
  render() {
    return <Textfield
      type = 'text'
      name = {this.props.name}
      label = {this.props.label}
      placeholder = {this.props.placeholder ?? ""}
      onChange = {this.props.onChange}
      required = {this.props.required === true}
      defaultValue = {this.props.defaultValue ?? ""}
      error = {this.props.error}
      className = "eq-shorttext"
    />
  }
}

ShortText.validateField = (field, required) => {
  if (!field.type || field.type !== 'shortText') {
    return false
  }

  if (required && !field.value) {
    field.error = (<div>
      Field <strong>{field.text}</strong> is required.
    </div>)
    return false
  }

  return true
}

ShortText.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
}

export default ShortText
