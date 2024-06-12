import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { H1, Button } from '@blueprintjs/core'
import dateFormat from 'dateformat'

import Textfield from 'components/Textfield'
import SelectField from 'components/SelectField'
import MultiSelectField from 'components/MultiSelectField'

import 'styles/PortfolioForm.css'

class PortfolioForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.name || '',
      grades: props.grades || [],
      subject: props.subject || '',
      topic: props.topic || '',
    }
  }

  render() {
    const subjects = ['Arts', 'History', 'Language Arts', 'Mathematics', 'PE', 'Science']
    const grades = [
      { value: 'Pre-K', label: 'Pre-K' },
      { value: 'K', label: 'Kindergarten' },
      { value: '1st', label: '1st Grade' },
      { value: '2nd', label: '2nd Grade' },
      { value: '3rd', label: '3rd Grade' },
      { value: '4th', label: '4th Grade' },
      { value: '5th', label: '5th Grade' },
      { value: '6th', label: '6th Grade' },
      { value: '7th', label: '7th Grade' },
      { value: '8th', label: '8th Grade' },
      { value: '9th', label: '9th Grade' },
      { value: '10th', label: '10th Grade' },
      { value: '11th', label: '11th Grade' },
      { value: '12th', label: '12th Grade' },
    ]

    return (
      <div className="PortfolioForm" role="main">
        <H1 style={{ textAlign: 'center' }}>
          Edit {this.props.name}
        </H1>
        {this.renderDeleteButton()}

        <div className="row">
          <Textfield
            name="name"
            label="My Portfolio Name"
            onChange={this.changeInput}
            defaultValue={this.props.name}
          />

          <div className="mini-group">
            <div>
            <label>
              Date Created
            </label>
            <span>
              {dateFormat(this.props.created_at, 'mm/dd/yy')}
            </span>
          </div>

          <div className="mini">
            <label>
              Artifacts
            </label>
            <span>
              {this.props.artifacts.length}
            </span>
          </div>

          <div className="mini">
            <label>
              Template
            </label>
            <span>
              Basic
            </span>
          </div>
          </div>
        </div>

        <div className="row">
          <MultiSelectField
            name="grades"
            label="Grade Levels"
            options={grades}
            defaultValues={this.props.grades}
            onChange={this.changeInput}
          />

          <SelectField
            name="subject"
            label="Subject"
            options={subjects}
            defaultValue={this.props.subject}
            onChange={this.changeInput}
          />
        </div>

        <div className="row">
          <Textfield
            name="topic"
            label="Portfolio Topic"
            onChange={this.changeInput}
            defaultValue={this.props.topic}
          />

          <div className="bp3-form-group" />
        </div>

        <div className="controls">
          <Link
            className="bp3-button bp3-minimal eq-button link-button"
            to={'/my-portfolios/' + this.props.id}
          >
            CANCEL
          </Link>
          <Button
            className="bp3-button bp3-minimal eq-button eq-button-inverted"
            onClick={this.submit}
          >
            SAVE
          </Button>
        </div>
      </div>
    )
  }

  renderDeleteButton() {
    if (this.props.artifacts.length > 0) {
      return null
    }

    return (
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-borderless eq-button-icon-left decline"
        onClick={this.confirmDelete}
      >
        Delete Portfolio
      </Button>
    )
  }

  changeInput = (event) => {
    const name = event.currentTarget.name
    const val = event.currentTarget.value
    let newState = {}

    newState[name] = val
    this.setState(newState)
  }

  submit = () => {
    if (!this.state.name.trim()) {
      window.alert('A name is required.')
      return
    }

    this.props.onSubmit(this.state)
  }

  confirmDelete = () => {
    const msg = 'Do you want to delete ' + this.props.name + '?'

    if (window.confirm(msg)) {
      this.props.onDelete()
    }
  }
}

PortfolioForm.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  artifacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  grades: PropTypes.arrayOf(PropTypes.string).isRequired,
  subject: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default PortfolioForm
