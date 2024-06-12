import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { H1, Button } from '@blueprintjs/core'

import { fetchMyPortfolios } from 'store/portfolios'
import { createArtifact } from 'store/artifacts'
import { setRedirect, shouldReload } from 'store/session'
import ArtifactListParkingLot from 'components/ArtifactListParkingLot'
import PortfolioSummary from 'components/PortfolioSummary'
import SearchBox from 'components/SearchBox'
import SelectField from 'components/SelectField'
import FilterBy from 'components/FilterBy'
import portfolioSort from 'helpers/portfolioSort'

import 'styles/Portfolios.css'
import 'styles/selectfields.css'

class MyPortfolios extends React.Component {
  constructor(props) {
    super(props)

    const id = props.match.params.id ? parseInt(props.match.params.id, 10) : null
    const artifactId = props.match.params.artifactId ? parseInt(props.match.params.artifactId, 10) : null

    this.state = {
      portfolios: null,
      selectedPortfolioId: id,
      filteredArtifacts: null,
      keywords: '',
      defaultPortfolioId: id,
      defaultArtifactId: artifactId,
      filterBy: {},
    }
  }

  componentDidMount() {
    this.props.fetchMyPortfolios()

    // If user was redirected here then its job is done, so clear it
    if (this.props.session.redirect) {
      this.props.setRedirect(null)
    }
  }

  componentDidUpdate() {
    if (this.props.session.reload) {
      this.filterArtifacts()
      this.props.shouldReload(false)
    }
  }

  render() {
    if (!this.props.portfolios) {
      return null
    }

    else if (this.props.artifacts && this.props.artifacts.newArtifactId) {
      return (
        <Redirect to={'/my-portfolios/' + this.state.selectedPortfolioId + '/artifacts/' + this.props.artifacts.newArtifactId + '/edit'} />
      )
    }

    return (
      <div className="eq-page">
        <div
          role="main"
          id="main-content"
          className="portfolios"
          style={{ position: 'relative' }}
        >
          <H1 className="eq-title-block">My Portfolios</H1>
          {this.renderNewArtifactButton()}
          {this.renderFilterPortfolioForm()}
          {this.renderPortfolio()}
        </div>
      </div>
    )
  }

  renderPortfolio() {
    const portfolio = this.getSelectedPortfolio()

    if (portfolio) {
      return (
        <div key={portfolio.id || 0}>
          {this.renderPortfolioSummary(portfolio)}
          <ArtifactListParkingLot
            artifacts={this.state.filteredArtifacts || portfolio['artifacts']}
            compare={true}
            defaultSelected={this.state.defaultArtifactId}
          />
        </div>
      )
    } else {
      return null
    }
  }

  renderFilterPortfolioForm() {
    let options = []

    if (this.props.portfolios) {
      options = Object.values(this.props.portfolios).map(portfolio => ({
        label: portfolio.name || portfolio.id,
        value: portfolio.id,
      }))
    }

    options.sort(portfolioSort)
    options = [{
      label: 'Select a portfolio',
      value: '',
    }].concat(options)

    return (
      <div className="form--eq-artifact-filters">
        <div className="eq-artifact-filters">
          <SelectField
            name="select_portfolio"
            label="Select Portfolio"
            onChange={this.selectPortfolio}
            options={options}
            defaultValue={this.state.defaultPortfolioId}
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

  renderPortfolioSummary(portfolio) {
    let summaryDesc = {}

    if (portfolio['grades']) {
      summaryDesc['Grade Levels'] = portfolio['grades'].map(grade => (
        <span className="grade">{grade}</span>
      ))
    }

    if (portfolio['created_at']) {
      summaryDesc['Date Created'] = new Date(
        portfolio['created_at']).toLocaleDateString(
          'en-US', {year: 'numeric', month: '2-digit', day: '2-digit'
        }
      )
    }

    if (portfolio['subject']) {
      summaryDesc['Subject'] = portfolio['subject']
    }

    summaryDesc['Total Artifacts'] = portfolio['artifacts'].length

    if (portfolio['topic']) {
      summaryDesc['Portfolio Topic'] = portfolio['topic']
    }

      summaryDesc['Template'] = "Basic"

    return (
      <PortfolioSummary
        key={portfolio['id']}
        name={portfolio['name']}
        dl={summaryDesc}
        actions={
          <React.Fragment>
            {/* temp emove the export */}
            {/* <Button
              className="bp3-button bp3-minimal eq-button eq-square-button small"
              onClick={this.submit}
            >
              Export
            </Button> */}
            <Link
              to={'/my-portfolios/' + portfolio.id + '/edit'}
              className="bp3-button bp3-minimal eq-button eq-button-inverted eq-square-button small"
            >
              Edit
            </Link>
          </React.Fragment>
        }
      />
    )
  }

  renderNewArtifactButton() {
    if (!this.state.selectedPortfolioId) {
      return null
    }

    return (
      <Button
        className="bp3-button bp3-minimal eq-button link-button"
        style={{ position: 'absolute', right: 0, top: 0 }}
        onClick={this.createArtifact}
      >
        Create New Artifact
      </Button>
    )
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

    this.setState({filteredArtifacts: filteredArtifacts})
  }

  isValidPortfolioId(id) {
    if (!id) {
      return false
    }

    if (!this.props.portfolios) {
      return false
    }

    let isValid = false

    this.props.portfolios.every(portfolio => {
      if (portfolio.id === id) {
        isValid = true
        return false
      }
      return true
    })

    return isValid
  }

  selectPortfolio = (event) => {
    const id = event.currentTarget.value

    this.setState({
      filteredArtifacts: null,
      selectedPortfolioId: id ? parseInt(id, 10) : null,
      defaultArtifactId: null,
    }, () => {
      if (!isNaN(parseInt(id, 10)) && this.isValidPortfolioId(parseInt(id, 10))) {
        window.history.replaceState(this.state,
          "My Portfolios", "/my-portfolios/" + id);
      }
      this.filterArtifacts()
    })
  }

  getSelectedPortfolio() {
    return this.props.portfolios.find(portfolio => (
      portfolio.id === this.state.selectedPortfolioId
    ))
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

  createArtifact = () => {
    const portfolio = this.props.portfolios.find(p => (
      p.id === this.state.selectedPortfolioId
    ))

    this.props.createArtifact(portfolio)
  }
}

const mapStateToProps = state => ({
  artifacts: state.artifacts,
  portfolios: state.portfolios,
  session: state.session,
})

const mapDispatchToProps = dispatch => ({
  fetchMyPortfolios: () => dispatch(fetchMyPortfolios()),
  createArtifact: (portfolio) => dispatch(createArtifact(portfolio)),
  setRedirect: path => dispatch(setRedirect(path)),
  shouldReload: flag => dispatch(shouldReload(flag)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyPortfolios)
