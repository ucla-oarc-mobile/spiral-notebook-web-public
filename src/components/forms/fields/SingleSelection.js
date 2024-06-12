import React from 'react'
import PropTypes from 'prop-types'

import {
  Radio,
  RadioGroup,
} from '@blueprintjs/core'

import 'styles/fields/SingleSelection.css'

class SingleSelection extends React.Component {
  render() {
    let idx = 1
    return <div role="radiogroup">
      <RadioGroup
        name={this.props.name}
        role="radiogroup"
        onChange={this.props.onChange}
        selectedValue={this.props.selectedValue}
        className={"single-selection" + ((this.props.required) ? " required" : "")}
        inline
        label={
          <div id={"radio-group--" + this.props.name + "--label"}>
            {this.props.label}
          </div>
        }
      >
        {this.renderError()}
          {
          this.props.choices.map(choice => {
            return <Radio
              role="radio"
              aria-labelledby={this.props.name + '--label--' + idx}
              value={choice}
              aria-checked={choice === this.props.selctedValue}
              required={this.props.required === true}
              key = {this.props.name + '--' + idx}
              name={this.props.name}
              id={this.props.name + '--' + idx}
              label={(
                <div
                  id={this.props.name + '--label--' + idx}
                  htmlFor={this.props.name + '--' + idx++}
                  className="radio-label"
                >{choice}</div>
              )}
            />
          })}
      </RadioGroup >
    </div>
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

SingleSelection.validateField = (field, required) => {
  if (!field.type || field.type !== 'singleSelection') {
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

SingleSelection.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValue: PropTypes.string
}

export default SingleSelection
