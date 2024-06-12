import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { H1, Button } from '@blueprintjs/core'
import ReactTable from 'react-table-v6'
import dateFormat from 'dateformat'

import Textfield from 'components/Textfield'
import SelectField from 'components/SelectField'
import MultiSelectField from 'components/MultiSelectField'

import 'styles/PortfolioTable.css'
import rightArrow from 'images/rightArrow.svg'
import sortIcon from 'images/sort.svg'

class PortfolioTable extends React.Component {
  static initialState = {
    editMode: false,
    name: '',
    grades: [],
    subject: '',
    topic: '',
  }

  constructor() {
    super()

    this.state = PortfolioTable.initialState
  }

  render() {
    let columns = []
    let heading

    if (this.props.type === 'my') {
      heading = 'My Portfolios'
    }
    else if (this.props.type === 'shared') {
      heading = 'Shared Portfolios'
    }
    else if (this.props.type === 'invitations') {
      heading = 'Invitations to Join Shared Portfolios'
      columns.push({
        id: 'from',
        Header: this.sortableHeader('Invite from'),
        minWidth: 157,
        accessor: data => this.renderInviteFrom(data),
        Cell: this.renderLinkCell(),
      })
    }

    columns.push({
      id: 'portfolio_name',
      Header: this.sortableHeader('Portfolio Name'),
      Footer: this.renderFooter('name'),
      accessor: 'name',
      minWidth: (this.props.type === 'my') ? 187 : 159,
      Cell: this.renderLinkCell(),
    })

    columns.push({
      id: 'date',
      Header: this.sortableHeader((this.props.type === 'invitations') ? 'Date Created': 'Date'),
      Footer: this.renderFooter('created_at'),
      minWidth: (this.props.type === 'invitations') ? 119 : 75,
      accessor: 'created_at',
      Cell: this.renderLinkCell(true),
    })

    if (this.props.type === 'my') {
      columns.push({
        id: 'parkingLotCount',
        className: 'parkingLotCount',
        Header: this.sortableHeader('Parking Lot'),
        minWidth: 108,
        accessor: data => this.parkingLotCount(data),
        Cell: this.renderHighlightCell(),
      },
      {
        id: 'artifactCount',
        Header: this.sortableHeader('Artifacts'),
        minWidth: 92,
        accessor: data => data.artifacts.length,
        Cell: this.renderLinkCell(),
      })
    }
    else if (this.props.type === 'shared') {
      columns.push({
        id: 'comments',
        className: 'comments',
        Header: this.sortableHeader('Comments'),
        minWidth: 100,
        accessor: data => this.commentCount(data),
        Cell: this.renderCommentCount(),
      })
    }

    if (['shared'].includes(this.props.type)) {
      columns.push({
        id: 'artifactCount',
        Header: this.sortableHeader('Artifacts'),
        minWidth: 92,
        accessor: data => data.sharedArtifacts.length,
        Cell: this.renderLinkCell(),
      })
    }

    let subjectWidth = 207
     if (this.props.type === 'shared') {
      subjectWidth = 112
    } else if (this.props.type === 'invitations') {
      subjectWidth = 120
    }


    columns.push({
      id: 'grades',
      Header: this.sortableHeader((this.props.type === 'invitations') ? 'Grade Levels' : 'Grade(s)'),
      minWidth: (this.props.type === 'invitations') ? 127 : 112,
      Footer: this.renderFooter('grades'),
      accessor: data => (data.grades || []).join(', '),
      Cell: this.renderLinkCell(),
    }, {
      Header: this.sortableHeader('Subject'),
      Footer: this.renderFooter('subject'),
      minWidth: subjectWidth,
      accessor: 'subject',
      Cell: this.renderLinkCell(),
    }, {
      Header: this.sortableHeader('Topic'),
      Footer: this.renderFooter('topic'),
      minWidth: 201,
      accessor: 'topic',
      Cell: this.renderLinkCell(),
    })

    if (['shared', 'invitations'].includes(this.props.type)) {
      columns.push({
        Header: this.sortableHeader('PLC Name'),
        accessor: 'plcName',
        minWidth: 200,
        Cell: this.renderLinkCell(),
      })
    }

    columns.push({
      id: 'icon',
      Header: '',
      accessor: data => <img src={rightArrow} alt="right arrow" />,
      Cell: this.renderLinkCell(),
      sortable: false,
      resizable: false,
      minWidth: 45,
    })

    let portfolios = null
    if (this.props.type === 'invitations') {
      portfolios = Object.values(this.props.portfolios).filter(invitation => (
        invitation.sharedPortfolio && Object.keys(invitation.sharedPortfolio).length > 0
      )).map(invitation => {
        let inv = {...invitation.sharedPortfolio}
        inv.from = invitation.from
        inv.invitationId = invitation.id
        return inv
      })
    } else {
      portfolios = this.props.portfolios
    }

    return (
      <div className="PortfolioTable">
        <H1 style={{ textAlign: 'center' }}>
          {heading}
        </H1>

        <ReactTable
          className="eq-react-table"
          columns={columns}
          data={portfolios}
          showPagination={false}
          minRows={0}
          resizable={false}
          NoDataComponent={() => null}
          defaultSorted={[{ id: 'date', desc: true }]}
        />

        {this.renderButtons()}
      </div>
    )
  }

  renderLinkCell(isDate) {
    return props => {
      let address = '/my-portfolios/' + props.original.id

      if (this.props.type === 'shared') {
        address = '/shared-portfolios/' + props.original.id
      }
      else if (this.props.type === 'invitations') {
        address = '/invitation/' + props.original.invitationId
      }

      return <Link to={address}>
        {isDate ? dateFormat(props.value, 'mm/dd/yy') : props.value}
      </Link>
    }
  }

  renderHighlightCell() {
    return props => {
      let address = ''

      if (this.props.type === 'my') {
        address = '/my-portfolios/' + props.original.id
      }
      else if (this.props.type === 'shared') {
        address = '/shared-portfolios/' + props.original.id
      }

      return (
        <Link to={address}>
          <span className={props.value > 0 ? 'highlight' : null}>
            {props.value}
          </span>
        </Link>
      )
    }
  }

  renderFooter(name) {
    if (this.props.type !== 'my' || !this.state.editMode) {
      return null
    }

    if (name === 'created_at') {
      return dateFormat(null, 'mm/dd/yy')
    }
    else if (name === 'grades') {
      return this.renderGradesMultiSelect()
    }
    else if (name === 'subject') {
      return this.renderSubjectSelect()
    }
    else if (name === 'template') {
      return this.renderTemplateSelect()
    }
    else {
      return this.renderTextInput(name)
    }
  }

  renderTextInput(name) {
    return (
      <Textfield name={name} onChange={this.changeInput} />
    )
  }

  renderGradesMultiSelect() {
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
      <MultiSelectField
        name="grades"
        options={grades}
        onChange={this.changeInput}
      />
    )
  }

  renderSubjectSelect() {
    const subjects = ['Arts', 'History', 'Language Arts', 'Mathematics', 'PE', 'Science']

    return (
      <SelectField
        name="subject"
        options={subjects}
        onChange={this.changeInput}
      />
    )
  }

  renderTemplateSelect() {
    const templates = ['Basic']

    return (
      <SelectField
        name="template"
        options={templates}
        onChange={this.changeInput}
      />
    )
  }

  renderButtons() {
    if (this.props.type !== 'my') {
      return null
    }

    if (this.state.editMode) {
      return (
        <div className="controls centered">
          <Button
            className="bp3-button bp3-minimal eq-button"
            onClick={this.cancel}
          >
            CANCEL
          </Button>

          <Button
            className="bp3-button bp3-minimal eq-button eq-button-inverted"
            onClick={this.save}
          >
            SAVE
          </Button>
        </div>
      )
    }
    else {
      return (
        <div className="controls">
          <Button
            className="bp3-button bp3-minimal eq-button eq-button-borderless eq-button-icon-left add"
            onClick={this.addPortfolio}
          >
            Add Portfolio
          </Button>
        </div>
      )
    }
  }

  addPortfolio = () => {
    this.setState({
      editMode: true,
    })
  }

  cancel = () => {
    this.setState(PortfolioTable.initialState)
  }

  save = () => {
    if (!this.state.name.trim()) {
      window.alert('A name is required.')
      return
    }

    this.props.onSubmit(this.state)
    this.setState(PortfolioTable.initialState)
  }

  changeInput = (event) => {
    const name = event.currentTarget.name
    const val = event.currentTarget.value
    let newState = {}

    newState[name] = val
    this.setState(newState)
  }

  parkingLotCount(data) {
    return data.artifacts.filter(artifact => artifact.parkingLot).length
  }

  commentCount(data) {
    let commentCount = 0

    if (data.commentCount) {
      commentCount = data.commentCount
    }

    return commentCount
  }

  renderCommentCount() {
    if (props => props.commentCount) {
      return this.renderHighlightCell()
    } else {
      return this.renderLinkCell()
    }
  }

  renderInviteFrom(data) {
    return <div>
      {data.from.username}<br />{data.from.email}
    </div>
  }

  sortableHeader(text) {
    return (
      <span>
        {text}
        <span className="sort">
          <img
            alt=""
            src={sortIcon}
          />
        </span>
      </span>
    )
  }
}

PortfolioTable.propTypes = {
  type: PropTypes.oneOf(['my', 'shared', 'invitations']).isRequired,
  portfolios: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func,
}

export default PortfolioTable
