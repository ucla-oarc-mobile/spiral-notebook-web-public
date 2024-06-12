import React from 'react'
import PropTypes from 'prop-types'

import { Checkbox, FormGroup, H2, H3 } from '@blueprintjs/core'
import ExpansionPanelChoices from './ExpansionPanelChoices'

class ExpansionPanelChoicesPlain extends React.Component {
  render() {
    this.createPanels()
    let idx = 0
    return <div role="group">
     <FormGroup
        id={this.props.name}
        label = {
          <span
            id={"expansion-panel--" + this.props.name + "--label"}
            className={this.props.name}
          >{this.props.label}</span>
        }
      >
        {this.panels.map(panel => (
          <FormGroup
            label = {this.renderPanelLabel(panel, idx)}
            key={this.props.name + "--panel--" + idx}
          >
            {this.renderSections(panel.sections, idx++)}
          </FormGroup>
        ))}
      </FormGroup>
    </div>
  }

  handleClick = (e, idx) => {
    let isOpen = this.state.isOpen
    isOpen[idx] = !this.state.isOpen[idx]
  }

  renderPanelLabel(panel, idx) {
    return <H2>{panel.label}</H2>
  }

  renderSections(sections, pIdx) {
    let sIdx = 0
    return sections.map(section => {
      let heading = null
      if (section.heading && section.heading.length) {
        heading = <H3>{section.heading}</H3>
      }
      return <React.Fragment key={"panel--" + pIdx + "--section--" + sIdx}>
        {heading}
        {this.renderCheckboxes(section.choices, pIdx, sIdx++)}
      </React.Fragment>
    })
  }

  renderCheckboxes(choices, pIdx, sIdx) {
    let cIdx = 0
    return choices.map(choice => {
      return <Checkbox
        checked = {this.props.selected.includes(choice)}
        label = {
          <span
            htmlFor={this.props.name + "--" + pIdx+ '--' + sIdx + '--' + (cIdx)}
          >{choice}</span>
        }
        name = {this.props.name}
        onChange = {this.props.onChange}
        value = {choice}
        id = {this.props.name + "--" + pIdx+ '--' + sIdx + '--' + (cIdx)}
        key = {this.props.name + "--" + pIdx+ '--' + sIdx + '--' + (cIdx++)}
      />
    })
  }

  createPanels() {
    this.panels = ExpansionPanelChoices.createPanels()
  }
}

ExpansionPanelChoicesPlain.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string)
}

export default ExpansionPanelChoicesPlain
