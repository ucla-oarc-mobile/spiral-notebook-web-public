import React from 'react'
import PropTypes from 'prop-types'
import 'react-awesome-slider/dist/styles.css'
import ExpansionPanelChoices from 'components/forms/fields/ExpansionPanelChoices'
import LongText from 'components/forms/fields/LongText'
import MultipleResponse from 'components/forms/fields/MultipleResponse'
import NumberResponse from 'components/forms/fields/NumberResponse'
import ShortText from 'components/forms/fields/ShortText'
import SingleSelection from 'components/forms/fields/SingleSelection'

class ArtifactField extends React.Component {
  render() {
    if (!this.props.response) {
      return null
    }

    let response = this.props.response
    let element = null

    switch (response.type) {
      case 'shortText':
        element = this.renderShortText(response)
        break
      case 'singleSelection':
        element = this.renderSingleSelection(response)
        break
      case 'number':
        element = this.renderNumber(response)
        break
      case 'multipleResponse':
        element = this.renderMultipleResponse(response)
        break
      case 'longText':
        element = this.renderLongText(response)
        break
      case 'expansionPanelChoices':
        element = this.renderExpansionPanelChoices(response)
        break

      default:
        // Make sure that all responses are renderable.
        element = (<p>{(response.value) ? response.value.toString() : ''}</p>)
        break
    }

    return <React.Fragment>
      <div className="artifact-field">
        {element}
      </div>
    </React.Fragment>
  }

  renderShortText(response) {
    if (!response) {
      return null
    }

    return <ShortText
      name = {response.key}
      error = {response.error ?? false}
      label={response.text}
      onChange={this.props.changeSingleValue}
      defaultValue={response.value ?? null}
      required = {(response.core ?? false)}
      bonus = {(response.core ?? false)}
    />
  }

  renderSingleSelection(response) {
    if (!response) {
      return null
    }

    return <SingleSelection
      name = {response.key}
      error = {response.error ?? false}
      label={response.text}
      onChange={this.props.changeSingleValue}
      selectedValue={response.value ?? null}
      choices={response.choices ?? []}
      required = {(response.core ?? false)}
      bonus = {(response.core ?? false)}
    />
  }

  renderNumber(response) {
    if (!response) {
      return null
    }

    return <NumberResponse
      name = {response.key}
      error = {response.error ?? false}
      label={response.text}
      onValueChange = {this.props.changeNumberValue}
      value={response.value ?? 0}
      min={response.min ?? 0}
      max={response.max ?? null}
      required = {(response.core ?? false)}
      bonus = {(response.core ?? false)}
    />
  }

  renderMultipleResponse(response) {
    if (!response) {
      return null
    }

    return <MultipleResponse
      name={response.key}
      error = {response.error ?? false}
      label={response.text}
      onChange={this.props.changeCheckBoxValue}
      choices = {response.choices ?? []}
      selected = {response.value ?? []}
      required = {(response.core ?? false)}
      bonus = {(response.core ?? false)}
    />
  }

  renderLongText(response) {
    if (!response) {
      return null
    }

    return <LongText
      label={response.text}
      name={response.key}
      error = {response.error ?? false}
      onChange={this.props.changeSingleValue}
      value={response.value ?? null}
      required = {(response.core ?? false)}
      bonus = {(response.core ?? false)}
    />
  }

  renderExpansionPanelChoices(response) {
    if (!response) {
      return null
    }

    return <ExpansionPanelChoices
      selected={response.value ?? []}
      name = {response.key}
      error = {response.error ?? false}
      label={response.text}
      onChange={this.props.changeCheckBoxValue}
      required = {(response.core ?? false)}
      bonus = {(response.core ?? false)}
    />
  }
}

ArtifactField.validateField = (field) => {
  let required = (field.core ?? false)

  switch (field.type) {
    case 'shortText':
      return ShortText.validateField(field, required)
    case 'singleSelection':
      return SingleSelection.validateField(field, required)
    case 'number':
      return NumberResponse.validateField(field, required)
    case 'multipleResponse':
      return MultipleResponse.validateField(field, required)
    case 'longText':
      return LongText.validateField(field, required)
    case 'expansionPanelChoices':
      return ExpansionPanelChoices.validateField(field, required)
    default:
      return true
  }
}

ArtifactField.propTypes = {
  response: PropTypes.object.isRequired,
  artifact: PropTypes.object.isRequired,
  changeSingleValue: PropTypes.func.isRequired,
  changeCheckBoxValue: PropTypes.func.isRequired,
  changeNumberValue: PropTypes.func.isRequired,
}

ArtifactField.defaultProps = {
}

export default ArtifactField
