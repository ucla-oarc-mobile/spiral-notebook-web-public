import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Menu, Popover, Button } from '@blueprintjs/core'

class MultiSelectField extends React.Component {
  constructor(props) {
    super(props)

    let state = {}

    props.options.forEach((option) => {
      state[option.value] = false
    })

    if (props.defaultValues) {
      props.defaultValues.forEach((value) => {
        state[value] = true
      })
    }

    this.state = state
  }

  render() {
    const options = this.props.options.map(option => (
      <Menu.Item
        key={option.value}
        text={option.label}
        onClick={() => this.toggleOption(option.value)}
        icon={this.state[option.value] ? 'tick' : 'blank'}
        shouldDismissPopover={false}
      />
    ))

    const menu = (
      <Menu>
        {options}
      </Menu>
    )

    return (
      <FormGroup
        labelFor={this.props.name}
        label={this.props.label}
        className="multi-select"
      >
        <Popover
          content={menu}
          boundary="window"
        >
          <Button className="bp3-minimal" rightIcon="chevron-down">
            {this.getSelectedOptions().join(', ') || ' '}
          </Button>
        </Popover>
      </FormGroup>
    )
  }

  toggleOption = (value) => {
    this.setState((prevState) => {
      let newState = {...prevState}
      newState[value] = !newState[value]

      return newState
    }, () => {
      // Send a follow-up fake event to notify the caller of the state change
      this.props.onChange({
        currentTarget: {
          name: this.props.name,
          value: this.getSelectedOptions(),
        }
      })
    })
  }

  getSelectedOptions() {
    return this.props.options.filter(option => (
      this.state[option.value]
    )).map(option => option.value)
  }
}

MultiSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  defaultValues: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.array.isRequired,
}

export default MultiSelectField
