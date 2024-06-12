import React from 'react'
import { connect } from 'react-redux'
import { H1, Button } from '@blueprintjs/core'
import dateFormat from 'dateformat'
import download from 'downloadjs'

import config from 'config'
import { fetchTeachers } from 'store/users'
import { clearPortfolios, fetchUserPortfolios } from 'store/portfolios'
import ArtifactListParkingLot from 'components/ArtifactListParkingLot'
import PortfolioSummary from 'components/PortfolioSummary'
import SearchBox from 'components/SearchBox'
import SelectField from 'components/SelectField'
import FilterBy from 'components/FilterBy'
import portfolioSort from 'helpers/portfolioSort'

import 'styles/Portfolios.css'
import 'styles/selectfields.css'

class TeacherPortfolios extends React.Component {
  constructor() {
    super()

    this.state = {
      selectedTeacherId: null,
      selectedPortfolioId: null,
      filteredArtifacts: null,
      keywords: '',
      filterBy: {},
    }
  }

  componentDidMount() {
    this.props.fetchTeachers()
  }

  render() {
    if (!this.props.users) {
      return null
    }

    return (
      <div className="eq-page">
        <div role="main" id="main-content" className="portfolios">
          <div className="portfolio-actions">
            <Button
              className="eq-button eq-button-inverted"
              onClick={this.runExport}
            >
              Export portfolios summary
            </Button>
          </div>

          <H1 className="eq-title-block">
            Teacher Portfolios
          </H1>

          {this.renderFilterPortfolioForm()}
          {this.renderPortfolio()}
        </div>
      </div>
    )
  }

  renderFilterPortfolioForm() {
    let userOptions = []
    let options = []

    if (this.props.users) {
      userOptions = Object.values(this.props.users).map((user) => {
        const names = user.username.split(' ')

        return {
          label: names.pop() + ', ' + names.join(' '),
          value: user.id,
        }
      })
    }

    if (this.props.portfolios) {
      options = Object.values(this.props.portfolios).map(portfolio => ({
        label: portfolio.name || portfolio.id,
        value: portfolio.id,
      }))
    }

    userOptions.sort((a, b) => {
      if (a.label < b.label) {
        return -1
      }
      else if (a.label > b.label) {
        return 1
      }
      else {
        return 0
      }
    })

    userOptions = [{
      label: 'Select a teacher',
      value: '',
    }].concat(userOptions)

    options.sort(portfolioSort)
    options = [{
      label: 'Select a portfolio',
      value: '',
    }].concat(options)

    return (
      <div className="form--eq-artifact-filters">
        <div className="eq-artifact-filters researcher-filters">
          <SelectField
            name="teacher"
            label="Select Teacher"
            onChange={this.selectTeacher}
            options={userOptions}
          />
          <SelectField
            name="select_portfolio"
            label="Select Portfolio"
            onChange={this.selectPortfolio}
            options={options}
            disabled={!this.getSelectedTeacher()}
          />
          <FilterBy
            filterByValues={this.state.filterBy}
            portfolio={this.getSelectedPortfolio()}
            onChange={this.filterByOnChange}
            onReset={() => {this.setState({filterBy: {}}, this.filterArtifacts)}}
            onSubmit={() => this.filterArtifacts()}
            showOnlyChoices={[]}
          />
          <SearchBox
            name='search'
            disabled={!this.state.selectedPortfolioId}
            onChange={event => this.setState({keywords: event.currentTarget.value})}
            onClick={this.filterArtifacts}
          />
        </div>
      </div>
    )
  }

  renderPortfolio() {
    const portfolio = this.getSelectedPortfolio()

    if (!portfolio) {
      return null
    }

    return (
      <div key={portfolio.id}>
        {this.renderPortfolioSummary(portfolio)}
        <ArtifactListParkingLot
          artifacts={this.state.filteredArtifacts || portfolio.artifacts}
          compare={true}
        />
      </div>
    )
  }

  renderPortfolioSummary(portfolio) {
    let summaryDesc = {}

    if (portfolio.grades) {
      summaryDesc['Grade Levels'] = portfolio.grades.map(grade => (
        <span className="grade">
          {grade}
        </span>
      ))
    }

    if (portfolio.created_at) {
      summaryDesc['Date Created'] = dateFormat(portfolio.created_at, 'mm/dd/yyyy')
    }

    if (portfolio.subject) {
      summaryDesc['Subject'] = portfolio.subject
    }

    summaryDesc['Total Artifacts'] = portfolio.artifacts.length

    if (portfolio.topic) {
      summaryDesc['Portfolio Topic'] = portfolio.topic
    }

    summaryDesc['Template'] = 'Basic'

    return (
      <PortfolioSummary
        key={portfolio.id}
        name={portfolio.name}
        dl={summaryDesc}
      />
    )
  }

  selectTeacher = (event) => {
    const val = event.currentTarget.value
    const id = val ? parseInt(val, 10) : null

    this.props.clearPortfolios()

    this.setState({
      filteredArtifacts: null,
      selectedTeacherId: id,
      selectedPortfolioId: null,
    })

    if (id) {
      this.props.fetchUserPortfolios(id)
    }
  }

  selectPortfolio = (event) => {
    const id = event.currentTarget.value

    this.setState({
      filteredArtifacts: null,
      selectedPortfolioId: id ? parseInt(id, 10) : null,
    }, () => {
      this.filterArtifacts()
    })
  }

  filterArtifacts = () => {
    let filteredArtifacts = null

    if (this.state.selectedPortfolioId) {
      const keyword = (this.state.keywords.length) ? this.state.keywords.toLowerCase() : ''

      // New objects are only 7 days old
      let date = new Date()
      let dateLimit = date.setDate(date.getDate() - 7).valueOf()

      // Filter by responses then by keywords
      filteredArtifacts = this.getSelectedPortfolio().artifacts.filter(artifact => (
        FilterBy.filterArtifact(
          artifact,
          {},
          {...this.state.filterBy},
          keyword,
          dateLimit,
        )
      ))
    }

    this.setState({ filteredArtifacts })
  }

  filterByOnChange = (e) => {
    let key = e.currentTarget.name
    let value = e.currentTarget.value
    let checked = e.currentTarget.checked
    let filterBy = this.state.filterBy

    if (!filterBy[key]) {
      filterBy[key] = {}
    }

    if (checked) {
      filterBy[key][value] = true
    } else {
      delete filterBy[key][value]
    }

    if (!Object.keys(filterBy[key]).length) {
      delete filterBy[key]
    }

    this.setState({filterBy: filterBy})
  }

  getSelectedTeacher() {
    if (!this.props.users) {
      return null
    }

    return this.props.users.find(user => (
      user.id === this.state.selectedTeacherId
    ))
  }

  getSelectedPortfolio() {
    if (!this.props.portfolios) {
      return null
    }

    return this.props.portfolios.find(portfolio => (
      portfolio.id === this.state.selectedPortfolioId
    ))
  }

  runExport = async () => {
    const jwt = this.props.session.jwt
    const url = config.api.baseUrl + '/portfolios/export'

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt
      }
    })

    if (!response.ok) {
      window.alert(await response.text())
      return
    }

    const blob = await response.blob()
    download(blob, 'teacher portfolios.csv')
  }
}

const mapStateToProps = state => ({
  users: state.users,
  portfolios: state.portfolios,
  session: state.session,
})

const mapDispatchToProps = dispatch => ({
  fetchTeachers: () => dispatch(fetchTeachers()),
  clearPortfolios: () => dispatch(clearPortfolios()),
  fetchUserPortfolios: userId => dispatch(fetchUserPortfolios(userId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPortfolios)
