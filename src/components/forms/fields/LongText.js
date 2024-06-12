import React from 'react'
import PropTypes from 'prop-types'

import {
  FormGroup,
  TextArea,
} from '@blueprintjs/core'

import 'styles/fields/LongText.css'

class LongText extends React.Component {
  render() {
    return <FormGroup
      label={this.props.label}
      labelFor={this.props.name}
      className={"eq-long-text" + ((this.props.required) ? " required" : "")}
    >
      {this.renderError()}
      <TextArea
        name={this.props.name}
        id={this.props.name}
        growVertically={true}
        large={true}
        onChange={this.props.onChange}
        placeholder={this.props.placeholder ?? ""}
        value={this.props.value ?? ""}
        required={this.props.required === true}
      />
    </FormGroup>
  }

  renderError() {
    if (!this.props.error) {
      return null
    }

    return <div className="field-error">
      {this.props.error}
    </div>
  }
}

LongText.validateField = (field, required) => {
  if (!field.type || field.type !== 'longText') {
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

LongText.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
}

export default LongText
