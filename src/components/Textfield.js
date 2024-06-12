import React from 'react'
import PropTypes from 'prop-types'

import {
  FormGroup,
  InputGroup,
} from '@blueprintjs/core'

import 'styles/textfields.css'

class Textfield extends React.Component {
  render() {
    let props = {
      ...this.props
    }

    let required = (props.required) ? {
      required: true,
    } : null;

    return <FormGroup
      labelFor={props.name}
      label={props.label}
      className={"eq-textfield" + (this.props.required) ? " required" : ""}
    >
    {this.renderError()}
    <InputGroup
        type={props.type ?? 'text'}
        id={props.name}
        name={props.name}
        placeholder={props.placeholder ?? ''}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        {...required}
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

Textfield.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
}

export default Textfield
