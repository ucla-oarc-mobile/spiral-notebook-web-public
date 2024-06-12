import React from 'react'
import PropTypes from 'prop-types'
import ModalPopover from './ModalPopover'
import { Button, Checkbox, FormGroup } from '@blueprintjs/core'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import ExpansionPanelChoicesPlain from './forms/fields/ExpandionPanelChoicesPlain'
import 'styles/FilterBy.css'

class FilterBy extends React.Component {
  render() {
    if (!this.props.portfolio) {
      return <Button
        className="bp3-button bp3-minimal eq-button"
        disabled
      >
        Filter By
      </Button>
    }

    let filterCount = this.getFilterByCount()
    return <ModalPopover
      popoverClassName="filter-by-modal-popover-wrapper"
      portalClassName="filter-by-modal-popover-container"
      title="Filter By"
      content={this.renderFilterByForm()}
    >
      <Button
        className={"bp3-button bp3-minimal eq-button" + ((filterCount) ? ' eq-button-inverted' : '')}
      >Filter By{((filterCount) ? ': ' + filterCount : '')}</Button>
    </ModalPopover>
  }

  getFilterByCount() {
    let count = 0

    let filters = this.props.filterByValues
    if (!filters || Object.keys(filters).length < 1) {
      return count
    }


    for (let filter in filters) {
      count += Object.values(filters[filter]).length
    }

    return count
  }

  renderFilterByForm() {
    let keep = [
      'singleSelection',
      'multipleResponse',
    ]

    let structure = []
    this.props.portfolio?.structure.forEach(fieldType => {
      if (keep.includes(fieldType.type)) {
        structure.push(fieldType)
      }
    })

    return <form>
      <div>
        {this.renderSharedPortfolioFilters()}
        {structure.map(field => {
          return this.renderFilterByItem(field)
        })}
        {this.renderExpansionPanelChoices()}
      </div>
      {this.renderActions()}
    </form>
  }

  renderExpansionPanelChoices() {
    let selected = []

    if (this.props.filterByValues?.standardFrameworkTags) {
      selected =  Object.keys(this.props.filterByValues.standardFrameworkTags)
    }

    return <ExpansionPanelChoicesPlain
      selected={selected}
      name = "standardFrameworkTags"
      error = {false}
      label= "Standards or Elements of Framework"
      onChange={this.props.onChange}
      required = {(false)}
      bonus = {(false)}
    />
  }

  getChecked(field, choice) {
    let checked = false
    let values = this.props.filterByValues
    if (values && values[field.key] && values[field.key]) {
      checked = (values[field.key][choice]) ? true : false
    }

    return checked
  }

  renderFilterByItem(field) {
    if (!field.choices || field.choices.length < 1) {
      return null
    }

    return <FormGroup
      labelFor={field.key}
      label={field.text}
      className={"filter-by-" + field.key}
      key={"filter-by-" + field.key}
    >
      {field.choices.map(choice => {
        return <Checkbox
          checked = {this.getChecked(field, choice)}
          label = {choice}
          name = {field.key}
          value = {choice}
          key = {"filter-by-" + choice}
          onChange = {(e) => this.props.onChange(e)}
        />
      })}
    </FormGroup>
  }

  renderActions() {
    return <div className="filter-by-actions-wrapper">
    <div className="filter-by-actions delete-member-actions">
      <Button
        className={"bp3-button bp3-minimal eq-button reset"}
        onClick={this.props.onReset}
        >
          Reset All Filters
      </Button>
      <Button
        className={"bp3-button bp3-minimal eq-button eq-button-inverted " + POPOVER_DISMISS}
        type="submit"
        onClick={(e) => {
          e.preventDefault()
          this.props.onSubmit()
        }}
      >
        Apply
      </Button>
    </div>
  </div>
  }

  renderSharedPortfolioFilters() {
    if (!this.props.showOnlyChoices.length) {
      return null
    }

    const options = [{
      key: 'myArtifacts',
      text: 'Show Only',
      choices: ['My Artifacts'],
    }, {
      key: 'grade',
      text: 'Grade',
      choices: ['Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'],
    }, {
      key: 'reactions',
      text: 'Has Reactions',
      choices: ['🔖', '⭐', '🌉', '❓'],
    }]

    return options.map(option => this.renderFilterByItem(option))
  }
}

FilterBy.hasShowOnlyFilters = (showOnly, artifact, dateLimit, uId = null)  => {
  // verify that we need to filter by this.
  if (!showOnly || !Object.keys(showOnly).length) {
    return true
  }

  return Object.keys(showOnly).every(key => {
    if (!showOnly[key]) {
      return true
    }

    if (key === 'myArtifacts') {
      return artifact.owner === uId
    }

    else if (key === 'grade') {
      const possibilities = Object.keys(showOnly.grade)
      const grades = artifact.portfolioGrades || []

      return possibilities.some(grade => grades.includes(grade))
    }

    else if (key === 'reactions') {
      const possibilities = Object.keys(showOnly.reactions)
      return possibilities.some(emoji => artifact.reactions[emoji])
    }

    return true
  })
}

FilterBy.hasResponseFilters = (filterBy, artifact) => {
  // verify that we need to filter by this.
  if (!filterBy || !Object.keys(filterBy).length) {
    return true
  }

  return Object.keys(filterBy).every(question => {
    const possibilities = Object.keys(filterBy[question])
    const response = artifact.responses[question]

    if (!response) {
      return false
    }

    if (Array.isArray(response)) {
      return response.some(choice => possibilities.includes(choice))
    }

    return possibilities.includes(response)
  })
}

FilterBy.filterArtifact = (artifact, showOnly, filterBy, keyword, dateLimit, uId = null) => {
  if (!FilterBy.hasShowOnlyFilters(showOnly, artifact, dateLimit, uId)) {
    return false
  }

  if (!FilterBy.hasResponseFilters(filterBy, artifact)) {
    return false
  }

  if (!keyword) {
    return true
  }

  const responses = Object.values(artifact.responses)
  if (responses.some((response) => {
    if (Array.isArray(response)) {
      return response.some(choice => choice.toLowerCase().includes(keyword))
    }
    else {
      return response.toString().toLowerCase().includes(keyword)
    }
  })) {
    return true
  }

  // Search comments if available
  const comments = artifact.commentTexts || []
  if (comments.some(text => text.toLowerCase().includes(keyword))) {
    return true
  }

  return false
}

FilterBy.propTypes = {
  filterByValues: PropTypes.object.isRequired,
  portfolio: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  showOnlyChoices: PropTypes.array
}

export default FilterBy
