import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, HTMLSelect } from '@blueprintjs/core'

class SelectField extends React.Component {
  render() {
    return (
      <FormGroup
        labelFor={this.props.name}
        label={this.props.label}
      >
      <HTMLSelect
        name={this.props.name}
        id={this.props.name}
        className="eq-select"
        iconProps={{ icon: 'chevron-down', color:  "#2774AE"}}
        defaultValue={this.props.defaultValue}
        onChange={this.props.onChange}
        options={this.props.options}
        disabled={this.props.disabled}
      />
    </FormGroup>
    )
  }
}

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
}

export default SelectField
