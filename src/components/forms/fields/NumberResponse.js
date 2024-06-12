import React from 'react'
import PropTypes from 'prop-types'

import {
  FormGroup,
  NumericInput,
} from '@blueprintjs/core'

import 'styles/fields/Number.css'

class NumberResponse extends React.Component {
  render() {
    return <FormGroup
      label={this.props.label}
      labelFor={this.props.name}
      className={"eq-number" + ((this.props.required) ? " required" : "")}
    >
      {this.renderError()}
      <NumericInput
        name={this.props.name}
        id={this.props.name}
        allowNumericCharactersOnly={true}
        value={this.props.value}
        step={1}
        onValueChange={this.props.onValueChange}
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

NumberResponse.validateField = (field, required) => {
  if (!field.type || field.type !== 'number') {
    return false
  }

  let isEmpty = (field.value === null || field.value === undefined || field.value === '')
  if (required && isEmpty) {
    field.error = (<div>
      Field <strong>{field.text}</strong> is required.
    </div>)
    return false
  }

  // Verify the value is an integer if it is not empty
  if (!isEmpty && !Number.isInteger(field.value)) {
    field.error = (<div>
      Field <strong>{field.text}</strong> must be an integer.
    </div>)
    return false
  }

  return true
}

NumberResponse.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onValueChange: PropTypes.func,
}

export default NumberResponse
