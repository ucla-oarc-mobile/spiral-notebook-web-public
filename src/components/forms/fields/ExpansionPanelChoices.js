import React from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  Checkbox,
  Collapse,
  FormGroup,
  H2,
  H3,
} from '@blueprintjs/core'

import 'styles/fields/ExpansionPanelChoices.css'

class ExpansionPanelChoices extends React.Component {

  constructor() {
    super()

    this.state = {
      isOpen: [],
    }
  }

  render() {
    this.createPanels()
    let idx = 0
    return <div role="group">
      <FormGroup
        id = {this.props.name}
        className={"eq-expansion-panel-choices" + ((this.props.required) ? " required" : "")}
        label = {
          <span
            id={"expansion-panel--" + this.props.name + "--label"}
            className={this.props.name}
          >{this.props.label}</span>
        }
      >
        {this.renderError()}
        {this.panels.map(panel => (
          <FormGroup
            label = {this.renderPanelLabel(panel, idx)}
            key={this.props.name + "--panel--" + idx}
            className={"eq-panel"}
          >
            <Collapse isOpen={this.state.isOpen[idx]}>
              {
                this.renderSections(panel.sections, idx++)
              }
            </Collapse>
          </FormGroup>
        ))}
      </FormGroup>
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

  handleClick = (e, idx) => {
    e.preventDefault()
    let isOpen = this.state.isOpen
    isOpen[idx] = !this.state.isOpen[idx]
    this.setState({ isOpen: isOpen })
  }

  renderPanelLabel(panel, idx) {
    if (this.state.isOpen[idx] === null || this.state.isOpen[idx] === undefined) {
      let isOpen = this.state.isOpen
      isOpen[idx] = false
      this.setState({
        isOpen: isOpen
      })
    }

    return <Button
      className={"eq-panel-label eq-button eq-button-inverted eq-button-icon-left " + (this.state.isOpen[idx] ? " hide" : " show")}
      onClick={(e) => this.handleClick(e, idx)}
    ><H2>{panel.label}</H2></Button>
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

ExpansionPanelChoices.createPanels = () => {
  return [{
      label: "Practices for K-12 Science Classrooms",
      sections: [{
        choices: [
          "Asking questions (for science) and defining problems (for engineering)",
          "Developing and using models",
          "Planning and carrying out investigations",
          "Analyzing and interpreting data",
          "Using mathematics, information and computer technology, and computational thinking",
          "Constructing explanations (for science) and designing solutions (for engineering)",
          "Engaging in argument from evidence",
          "Obtaining, evaluating, and communicating information",
        ]
      }]
    },
    {
      label: "Crosscutting Concepts",
      sections: [{
        choices: [
          "Patterns",
          "Cause and Effect",
          "Scale, Proportion, and Quantity",
          "Systems and System Models",
          "Energy and Matter",
          "Structure and Function",
          "Stability and Change",
        ]
      }]
    },
    {
      label: "Core Ideas in Physical Sciences",
      sections: [
        {
          heading: "Core Idea PS1: Matter and Its Interactions",
          choices: [
            "PS1.A: Structure and Properties of Matter",
            "PS1.B: Chemical Reactions",
            "PS1.C: Nuclear Processes",
          ]
        },
        {
          heading: "Core Idea PS2: Motion and Stability: Forces and Interactions",
          choices: [
            "PS2.A: Forces and Motion",
            "PS2.B: Types of Interactions",
            "PS2.C: Stability and Instability in Physical Systems",
          ]
        },
        {
          heading: "Core Idea PS3: Energy",
          choices: [
            "PS3.A: Definitions of Energy",
            "PS3.B: Conservation of Energy and Energy Transfer",
            "PS3.C: Relationship Between Energy and Forces",
            "PS3.D: Energy in Chemical Processes and Everyday Life",
          ]
        },
        {
          heading: "Core Idea PS4: Waves and Their Applications in Technologies for Information Transfer",
          choices: [
            "PS4.A: Wave Properties",
            "PS4.B: Electromagnetic Radiation",
            "PS4.C: Information Technologies and Instrumentation",
          ]
        }
      ]
    },
    {
      label: "Core Ideas in Life Sciences",
      sections: [
        {
          heading: "Core Idea LS1: From Molecules to Organisms: Structures and Processes",
          choices: [
            "LS1.A: Structure and Function",
            "LS1.B: Growth and Development of Organisms",
            "LS1.C: Organization for Matter and Energy Flow in Organisms",
            "LS1.D: Information Processing",
          ]
        },
        {
          heading: "Core Idea LS2: Ecosystems: Interactions, Energy, and Dynamics",
          choices: [
            "LS2.A: Interdependent Relationships in Ecosystems",
            "LS2.B: Cycles of Matter and Energy Transfer in Ecosystems",
            "LS2.C: Ecosystem Dynamics, Functioning, and Resilience",
            "LS2.D: Social Interactions and Group Behavior",
          ]
        },
        {
          heading: "Core Idea LS3: Heredity: Inheritance and Variation of Traits",
          choices: [
            "LS3.A: Inheritance of Traits",
            "LS3.B: Variation of Traits",
          ]
        },
        {
          heading: "Core Idea LS4: Biological Evolution: Unity and Diversity",
          choices: [
            "LS4.A: Evidence of Common Ancestry and Diversity",
            "LS4.B: Natural Selection",
            "LS4.C: Adaptation",
            "LS4.D: Biodiversity and Humans",
          ]
        }
      ]
    },
    {
      label: "Core Ideas in Earth and Space Science",
      sections: [
        {
          heading: "Core Idea ESS1: Earth's Place in the Universe",
          choices: [
            "ESS1.A: The Universe and Its Stars",
            "ESS1.B: Earth and the Solar System",
            "ESS1.C: The History of Planet Earth",
          ]
        },
        {
          heading: "Core Idea ESS2: Earth's Systems",
          choices: [
            "ESS2.A: Earth Materials and Systems",
            "ESS2.B: Plate Tectonics and Large-Scale System Interactions",
            "ESS2.C: The Roles of Water in Earth's Surface Processes",
            "ESS2.D: Weather and Climate",
            "ESS2.E: Biogeology",
          ]
        },
        {
          heading: "Core Idea ESS3: Earth and Human Activity",
          choices: [
            "ESS3.A: Natural Resources",
            "ESS3.B: Natural Hazards",
            "ESS3.C: Human Impacts on Earth Systems",
            "ESS3.D: Global Climate Change",
          ]
        }
      ]
    },
    {
      label: "Core Ideas in Engineering, Technology and the Application of Science",
      sections: [
        {
          heading: "Core Idea ETS1: Engineering Design",
          choices: [
            "ETS1.A: Defining and Delimiting Engineering Problems",
            "ETS1.B: Developing Possible Solutions",
            "ETS1.C: Optimizing the Design Solution",
          ]
        }
      ]
    }
  ]
}

ExpansionPanelChoices.validateField = (field, required) => {
  if (!field.type || field.type !== 'expansionPanelChoices') {
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

ExpansionPanelChoices.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.any,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string)
}

export default ExpansionPanelChoices
