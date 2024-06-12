import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { H1, H2, Button, Switch, FormGroup, TextArea } from '@blueprintjs/core'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import ReactTable from 'react-table-v6'
import dateFormat from 'dateformat'
import { v1 } from 'uuid'

import Textfield from 'components/Textfield'
import SelectField from 'components/SelectField'
import MultiSelectField from 'components/MultiSelectField'
import EditParticipants from 'components/EditParticipants'
import ModalPopover from 'components/ModalPopover'

import 'styles/SharedPortfolioForm.css'
import deleteIcon from 'images/delete.svg'
import addIcon from 'images/addIcon.svg'

class SharedPortfolioForm extends React.Component {
  constructor(props) {
    super(props)

    const bonus = (props.structure || []).filter(question => question.bonus)
    const structure = props.templateStructure.map((question) => {
      const matching = (props.structure || []).find(q => q.key === question.key)

      return {
        ...question,
        checked: !!matching || question.core || !props.id,
        text: matching ? matching.text : question.text,
        choices: matching ? matching.choices : question.choices,
      }
    })

    this.state = {
      invalidKeys: {},
      name: props.name || '',
      members: props.members || [],
      grades: props.grades || [],
      subject: props.subject || '',
      topic: props.topic || '',
      plcName: props.plcName || '',
      plcGoals: props.plcGoals || '',
      structure: structure.concat(bonus).map((oldQuestion) => {
        let question = {...oldQuestion}

        if (question.choices) {
          question.choices = question.choices.join(', ')
        }
        else {
          delete question.choices
        }

        return question
      }),
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

    let pId = (this.props.id) ? this.props.id : ''
    let heading = 'Create New Shared Portfolio'
    let backUrl = '/shared-portfolios'  + pId

    if (this.props.redirectId) {
      backUrl = '/shared-portfolios/' + this.props.redirectId
    } else if (this.props.id) {
      backUrl = '/shared-portfolios/' + this.props.id
    }

    if (this.props.id) {
      heading = 'Edit ' + this.props.name
    }

    return (
      <div className="eq-page">
        <div role="main" id="main-content" className="SharedPortfolioForm">
          {this.renderDeleteAction()}

          <form onSubmit={this.submit}>
            <H1 className="eq-title-block">
              {heading}
            </H1>

            <H2>
              Summary
            </H2>

            <div className="row">
              <Textfield
                name="name"
                label="Shared Portfolio Name"
                onChange={this.changeInput}
                defaultValue={this.props.name}
              />

              <div className="double-width">
                {this.renderMembers()}
              </div>

              <div className="bp3-form-group">
                <label style={{ marginBottom: '5px' }}>
                  Date Created
                </label>
                <span>
                  {dateFormat(this.props.created_at, 'mm/dd/yy')}
                </span>
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

              <Textfield
                name="topic"
                label="Portfolio Topic"
                onChange={this.changeInput}
                defaultValue={this.props.topic}
              />

              <Textfield
                name="plcName"
                label="PLC Name"
                onChange={this.changeInput}
                defaultValue={this.props.plcName}
              />
            </div>

            <div className="row" style={{ width: '50%' }}>
              <FormGroup
                labelFor="plcGoals"
                label="PLC Goals for Shared Portfolio"
                style={{ marginRight: '10px' }}
              >
                <TextArea
                  name="plcGoals"
                  label="PLC Name"
                  onChange={this.changeInput}
                  defaultValue={this.props.plcGoals}
                />
              </FormGroup>
            </div>

            <H2>
              Questions
            </H2>

            {this.renderQuestions()}

            <div className="controls">
              <Link
                className="bp3-button bp3-minimal eq-button link-button"
                to={backUrl}
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
          </form>
        </div>
      </div>
    )
  }

  /**
   * Render the shared portfolio delete button.
   *
   * @returns
   */
  renderDeleteAction() {
    if (!this.props.onDelete) {
      return null
    }

    return <ModalPopover
      popoverClassName="delete-modal-popover-wrapper"
      portalClassName="delete-modal-popover-container"
      title="Delete Shared Portfolio"
      content={this.renderDeleteSharedPortfolioConfirmation()}
    >
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-borderless eq-button-icon-left decline"
      >
        Delete Shared Portfolio
      </Button>
    </ModalPopover>
  }

  renderDeleteSharedPortfolioConfirmation() {
    let confirmMessage = 'Do you want to delete ' + this.props.name + '?'

    return <div>
      <h2>{confirmMessage}</h2>
      <div className="actions">
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button " + POPOVER_DISMISS}
        >NO</Button>
        <Button
          className="bp3-button bp3-button bp3-minimal eq-button eq-button-inverted"
          onClick={this.props.onDelete}
        >
          YES
        </Button>
      </div>
    </div>
  }

  renderMembers() {
    if (!this.props.id) {
      return (
        <span>
          After you create this shared portfolio, you can share it with other users.
        </span>
      )
    }

    const memberNames = this.state.members.map(user => user.username)

    return (
      <>
        <label style={{ marginBottom: '5px' }}>
          Currently Shared with
        </label>
        <span>
          {memberNames.join(', ')}
        </span>
        <EditParticipants sharedPortfolio={{...this.props}} />
      </>
    )
  }

  renderQuestions() {
    const columns = [{
      accessor: 'checked',
      width: 70,
      Header: '',
      Cell: this.renderSwitch,
      Footer: this.renderAddButton,
    }, {
      accessor: 'text',
      maxWidth: 400,
      Header: 'Question',
      Cell: this.renderQuestion,
      Footer: 'Add Question',
    }, {
      accessor: 'type',
      width: 200,
      Header: 'Question Type',
      Cell: this.renderQuestionType,
    }, {
      accessor: 'choices',
      Header: 'Responses',
      Cell: this.renderChoices,
    }]

    return (
      <ReactTable
        columns={columns}
        data={this.state.structure}
        showPagination={false}
        minRows={0}
        resizable={false}
        sortable={false}
        getTrProps={(state, rowInfo, column) => ({
          key: rowInfo.original.key
        })}
      />
    )
  }

  renderSwitch = (props) => {
    if (props.original.bonus) {
      return (
        <img
          src={deleteIcon}
          alt="delete"
          onClick={() => this.deleteQuestion(props)}
          className="delete-question"
        />
      )
    }

    return (
      <Switch
        large
        disabled={props.original.core}
        defaultChecked={props.value}
        onChange={(event) => this.changeQuestion(event, props, 'checked')}
      />
    )
  }

  renderAddButton = (props) => {
    return (
      <img
        src={addIcon}
        alt="add"
        onClick={this.addQuestion}
        className="add-question"
      />
    )
  }

  renderQuestion = (props) => {
    let msg

    if (props.original.core) {
      return props.value
    }

    if (
      this.state.invalidKeys[props.original.key] && (
      !props.value || !props.value.trim()
    )) {
      msg = (
        <div className="invalid">
          Question text is required.
        </div>
      )
    }

    return (
      <div style={{ width: '100%' }}>
        {msg}
        <TextArea
          growVertically
          name={props.original.key + '.text'}
          defaultValue={props.value}
          onChange={(event) => this.changeQuestion(event, props, 'text')}
        />
      </div>
    )
  }

  renderQuestionType = (props) => {
    let msg
    const options = [{
      value: '',
      label: 'Question Type',
      disabled: true,
    }, {
      value: 'singleSelection',
      label: 'Single Selection',
    }, {
      value: 'multipleResponse',
      label: 'Multiple Response',
    }, {
      value: 'shortText',
      label: 'Short Text',
    }, {
      value: 'longText',
      label: 'Long Text',
    }, {
      value: 'number',
      label: 'Number',
    }]

    if (props.original.bonus) {
      if (this.state.invalidKeys[props.original.key] && !props.value) {
        msg = (
          <div className="invalid">
            Question type is required.
          </div>
        )
      }

      return (
        <div style={{ width: '100%' }}>
          {msg}
          <SelectField
            name={props.original.key + '.type'}
            options={options}
            defaultValue={props.value}
            onChange={(event) => this.changeQuestion(event, props, 'type')}
          />
        </div>
      )
    }

    else if (props.value === 'fileUpload') {
      return 'File Upload'
    }

    else if (props.value === 'expansionPanelChoices') {
      return 'Multiple Response'
    }

    else {
      return options.find(option => option.value === props.value).label
    }
  }

  renderChoices = (props) => {
    let msg

    if (props.original.type === 'fileUpload') {
      return 'Photo, Video, Document'
    }

    else if (props.original.type === 'expansionPanelChoices') {
      return 'Practices for K-12 Science Classrooms, Crosscutting Concepts, Core and Component Ideas in Physical Sciences'
    }

    else if (props.original.core) {
      return props.value
    }

    else if (
      props.original.type === 'singleSelection' ||
      props.original.type === 'multipleResponse'
    ) {
      if (
        this.state.invalidKeys[props.original.key] &&
        this.getChoices(props.original.key).length === 0
      ) {
        msg = (
          <div className="invalid">
            You must enter at least one choice.
          </div>
        )
      }

      return (
        <div style={{ width: '100%' }}>
          {msg}
          <TextArea
            name={props.original.key + '.choices'}
            defaultValue={props.value}
            onChange={(event) => this.changeQuestion(event, props, 'choices')}
          />
        </div>
      )
    }

    else {
      return null
    }
  }

  changeInput = (event) => {
    const name = event.currentTarget.name
    const val = event.currentTarget.value
    let newState = {}

    newState[name] = val
    this.setState(newState)
  }

  changeQuestion = (event, props, field) => {
    const val = field === 'checked' ? event.currentTarget.checked : event.currentTarget.value

    this.setState(prevState => ({
      structure: prevState.structure.map((question) => {
        if (question.key !== props.original.key) {
          return question
        }

        else {
          let newQuestion = {...question}
          newQuestion[field] = val

          return newQuestion
        }
      })
    }))
  }

  deleteQuestion = (props) => {
    this.setState(prevState => ({
      structure: prevState.structure.filter(question => (
        question.key !== props.original.key
      ))
    }))
  }

  addQuestion = () => {
    this.setState(prevState => ({
      structure: prevState.structure.concat({
        key: v1(),
        type: '',
        bonus: true,
      })
    }))
  }

  submit = () => {
    let params = {...this.state}
    let invalidKeys = {}

    if (!this.state.name.trim()) {
      window.alert('A name is required.')
      return
    }

    params.structure = this.state.structure.filter(question => (
      question.checked || question.bonus
    )).map((oldQuestion) => {
      let question = {...oldQuestion}
      delete question.checked

      if (!question.text || !question.text.trim() || !question.type) {
        invalidKeys[question.key] = true
      }

      if (['singleSelection', 'multipleResponse', 'expansionPanelChoices'].includes(question.type)) {
        question.choices = this.getChoices(question.key)

        if (question.choices.length === 0) {
          invalidKeys[question.key] = true
        }
      }

      else if (question.type === 'number') {
        question.min = 1
        question.max = 1
        question.step = 1
        delete question.choices
      }

      else {
        delete question.choices
      }

      return question
    })

    const invalidCount = Object.keys(invalidKeys).length

    if (invalidCount > 0) {
      let msg = 'You have ' + invalidCount + ' invalid question'
      if (invalidCount > 1) {
        msg += 's'
      }

      window.alert(msg + '. Please add the required info and re-submit.')

      this.setState({
        invalidKeys
      })

      return
    }

    delete params.members
    delete params.templateStructure

    this.props.onSubmit(params)
  }

  getChoices(key) {
    const question = this.state.structure.find(q => q.key === key)

    if (!question.choices || !question.choices.trim()) {
      return []
    }
    else {
      return question.choices.trim().split(/, */).map(choice => choice.trim()).filter(choice => choice)
    }
  }
}

SharedPortfolioForm.propTypes = {
  id: PropTypes.number,
  redirectId: PropTypes.number,
  name: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.object),
  created_at: PropTypes.string,
  grades: PropTypes.arrayOf(PropTypes.string),
  subject: PropTypes.string,
  topic: PropTypes.string,
  plcName: PropTypes.string,
  plcGoals: PropTypes.string,
  structure: PropTypes.arrayOf(PropTypes.object),
  templateStructure: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
}

export default SharedPortfolioForm
