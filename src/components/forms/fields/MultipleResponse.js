import React from 'react'
import PropTypes from 'prop-types'

import {
  Alignment,
  Checkbox,
  FormGroup,
} from '@blueprintjs/core'

import 'styles/fields/MultipleResponse.css'

class MultipleResponse extends React.Component {
  render() {
    return <div role="group">
      <FormGroup
        id={this.props.name}
        className={"eq-multiple-response" + ((this.props.required) ? " required" : "")}
        label={
          <div id={"multiple-response--" + this.props.name + "--label"}>
            {this.props.label}
          </div>
        }
      >
        {this.renderError()}
        {this.renderCheckboxes()}
      </FormGroup>
    </div>
  }

  renderCheckboxes() {
    let idx = 1
    return this.props.choices.map(choice => {
      return <Checkbox
        checked={this.props.selected.includes(choice)}
        alignIndicator={Alignment.RIGHT}
        name={this.props.name}
        onChange={this.props.onChange}
        value={choice}
        className={"eq-button eq-icon-right" + (this.props.selected.includes(choice) ? " eq-button-inverted eq-checked" : "")}
        id={this.props.name + "--" + idx}
        key={this.props.name + "--" + idx}
      >
        <span htmlFor={this.props.name + "--" + idx++}>{choice}</span>
        <div className="icon eq-checkbox-icon"></div>
      </Checkbox>
    })
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

MultipleResponse.validateField = (field, required) => {
  if (!field.type || field.type !== 'multipleResponse') {
    return false
  }

  if (required && (!field.value || field.value.length < 1)) {
    field.error = (<div>
      Field <strong>{field.text}</strong> requires at least one selection.
    </div>)
    return false
  }

  return true
}

MultipleResponse.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string)
}

export default MultipleResponse
