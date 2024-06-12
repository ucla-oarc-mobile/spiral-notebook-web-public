import React from 'react'
import PropTypes from 'prop-types'
import { Button, FormGroup, InputGroup } from '@blueprintjs/core'

class SearchBox extends React.Component {
  render() {
    return (
      <FormGroup
        labelFor={this.props.name}
        label='Keywords'
        className="eq-textfield eq-search"
        disabled={this.props.disabled}
      >
        <InputGroup
            type='text'
            id={this.props.name}
            name={this.props.name}
            onChange={this.props.onChange}
            disabled={this.props.disabled}
            onKeyPress={(e) => {
              switch (e.key) {
                case 'Enter': // Enter
                  e.preventDefault()
                  this.props.onClick()
                  break;

                default:
                  break;
              }
            }}
        />
        <Button
          className="bp3-button bp3-minimal eq-search-button"
          onClick={this.props.onClick}
          disabled={this.props.disabled}
          aria-label="Search"
        />
      </FormGroup>
    )
  }
}

SearchBox.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
}

SearchBox.defaultProps = {
  disabled: false,
}

export default SearchBox
