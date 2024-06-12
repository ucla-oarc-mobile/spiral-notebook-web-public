import React from 'react'
import { connect } from 'react-redux'
import ArtifactListComments from 'components/ArtifactListComments'
import { Button, H1 } from '@blueprintjs/core'
import PortfolioSummary from 'components/PortfolioSummary'
import SearchBox from 'components/SearchBox'
import SelectField from 'components/SelectField'
import { fetchSharedPortfolios, fetchSharedPortfolio, leaveSharedPortfolio } from 'store/shared-portfolios'
import 'styles/selectfields.css'
import 'styles/Portfolios.css'
import { Link, Redirect } from 'react-router-dom'
import FilterBy from 'components/FilterBy'
import ModalPopover from 'components/ModalPopover'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import { shouldReload, setRedirect } from 'store/session'
import portfolioSort from 'helpers/portfolioSort'
import config from 'config'
import download from 'downloadjs'

class SharedPortfolios extends React.Component {
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
      loaded: {},
    }
  }

  componentDidMount() {
    // If user was redirected here then its job is done, so clear it
    if (this.props.session.redirect) {
      this.props.setRedirect(null)
    }

    this.props.fetchSharedPortfolios().then(() => {
      if (this.isValidPortfolioId(this.state.selectedPortfolioId)) {
        this.props.fetchSharedPortfolio(this.state.selectedPortfolioId).then(
          () => {
            this.setSharedPortfolioLoaded(this.state.selectedPortfolioId)
          }
        )
      }
    })
  }

  componentDidUpdate() {
    if (this.props.session.reload) {
      this.filterArtifacts()
      this.props.shouldReload(false)
    }
  }

  render() {
    if (this.props.session.redirect) {
      return (
        <Redirect to={this.props.session.redirect} />
      )
    }

    if (!this.props.sharedPortfolios) {
      return null
    }

    let create = null
    if (['plc_lead', 'researcher'].includes(this.props.user.role.type)) {
      create = (
        <Link
          to={{
            pathname: "/shared-portfolios/new",
            state: {
              id: this.state.selectedPortfolioId
            }
          }}
          className="bp3-button eq-button link-button eq-button-inverted"
        >
          CREATE NEW SHARED PORTFOLIO
        </Link>
      )
    }

    let exportButton = null
    if (this.props.user.role.type === 'researcher') {
      exportButton = (
        <Button
          className="eq-button eq-button-inverted"
          onClick={this.runExport}
        >
          Export shared portfolios summary
        </Button>
      )
    }

    return (
      <div className="eq-page">
        <div role="main" id="main-content" className="portfolios">
          <div className="eq-title-section">
            <div className="portfolio-actions">
              {create}
              {exportButton}
            </div>
            <H1 className="eq-title-block">Shared Portfolios</H1>
          </div>
          {this.renderFilterPortfolioForm()}
          {this.renderPortfolio()}
        </div>
      </div>
    )
  }

  isValidPortfolioId(id) {
    if (!id) {
      return false
    }

    if (!this.props.sharedPortfolios) {
      return false
    }

    let isValid = false

    this.props.sharedPortfolios.every(portfolio => {
      if (portfolio.id === id) {
        isValid = true
        return false
      }
      return true
    })

    return isValid
  }

  setSharedPortfolioLoaded(pId) {
    let loaded = {...this.state.loaded}
    loaded[pId] = true
    this.setState({loaded: loaded})
  }

  isSharedPortfolioLoaded() {
    return this.state.selectedPortfolioId in this.state.loaded
  }

  renderPortfolio() {
    if (!this.isSharedPortfolioLoaded()) {
      return null
    }

    const portfolio = this.getSelectedPortfolio()

    if (portfolio) {
      let artifacts = (this.state.filteredArtifacts || portfolio['sharedArtifacts']).filter(
        (artifact) => {
          return !artifact.parkingLot
        }
      )

      return (
        <div key={portfolio.id || 0}>
          {this.renderPortfolioSummary(portfolio)}
          <ArtifactListComments
            artifacts={artifacts}
            compare={true}
            isMutable={true}
            shared={true}
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

    if (this.props.sharedPortfolios) {
      options = Object.values(this.props.sharedPortfolios).map(portfolio => ({
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
            showOnlyChoices={[
              "My Artifacts",
            ]}
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

    if (portfolio['plcName']) {
      summaryDesc['PLC Name Created'] = portfolio['plcName']
    }

    if (portfolio['subject']) {
      summaryDesc['Subject'] = portfolio['subject']
    }

    if (portfolio['created_at']) {
      summaryDesc['Date Created'] = new Date(
        portfolio['created_at']).toLocaleDateString(
          'en-US', {year: 'numeric', month: '2-digit', day: '2-digit'
        }
      )
    }

    if (portfolio['topic']) {
      summaryDesc['Portfolio Topic'] = portfolio['topic']
    }

    summaryDesc['Total Artifacts'] = portfolio['sharedArtifacts'].length

    let edit = null
    if (this.props.user.id === portfolio.owner.id) {
      edit = <Link
        to={"/shared-portfolios/" + this.state.selectedPortfolioId + "/edit"}
        className="bp3-button bp3-minimal eq-button eq-button-inverted eq-square-button small link-button"
      >
        Edit
      </Link>
    }

    return (
      <PortfolioSummary
        key={portfolio['id']}
        name={portfolio['name']}
        dl={summaryDesc}
        actions={
          <React.Fragment>
            {/* temp emove the export */}
            {this.renderSharedPortfolioLeaveAction()}
            <Button
              className="bp3-button bp3-minimal eq-button eq-square-button small"
              disabled
              onClick={() => alert('Clicked Export!')}
            >
              Export
            </Button>
            {edit}
          </React.Fragment>
        }
      />
    )
  }

  renderSharedPortfolioLeaveAction() {
    let role = this.props.user?.role
    if (!role || !this.getSelectedPortfolio()?.owner?.id) {
      return null
    }

    let leaveAction = null
    switch (role.type) {
      case 'authenticated':
        leaveAction = this.renderTeacherLeaveConfirmation()
        break;

      default:
        break;
    }

    // Prevent owners from leaving portfolio until the PLC Leave is created.
    if (!leaveAction || this.props.user.id === this.getSelectedPortfolio().owner.id) {
      return null
    }

    return <ModalPopover
      popoverClassName="delete-modal-popover-wrapper"
      portalClassName="delete-modal-popover-container"
      title="Leave Shared Portfolio"
      content={leaveAction}
    >
      <Button
        className="bp3-button bp3-minimal eq-button eq-square-button small eq-button-gray"
      >
        Leave
      </Button>
    </ModalPopover>
  }

  renderTeacherLeaveConfirmation() {
    return <div>
      <div className="description">
        Are you sure you want to end your membership in this Shared Portfolio?
        You will no longer be able to access artifacts or see comments uploaded
        to the portfolio.
      </div>
      <div className="actions">
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button " + POPOVER_DISMISS}
        >NO</Button>
        <Button
          className="bp3-button bp3-button bp3-minimal eq-button eq-button-inverted"
          onClick={() => {
            if (this.getSelectedPortfolio()?.id) {
              this.props.leaveSharedPortfolio(this.getSelectedPortfolio().id)
            }
          }}
        >YES</Button>
      </div>
    </div>
  }

  filterArtifacts = () => {
    let date = new Date()
    let dateLimit = date.setDate(date.getDate() - 7).valueOf()
    let filteredArtifacts = null

    if (this.state.selectedPortfolioId) {
      const keyword = (this.state.keywords.length) ? this.state.keywords.toLowerCase() : ''
      const { myArtifacts, grade, reactions, ...filterBy } = this.state.filterBy

      // Filter by responses then by keywords
      filteredArtifacts = this.getSelectedPortfolio().sharedArtifacts.filter(artifact => (
        FilterBy.filterArtifact(
          artifact,
          { myArtifacts, grade, reactions },
          filterBy,
          keyword,
          dateLimit,
          this.props.user.id,
        )
      ))
    }

    this.setState({filteredArtifacts: filteredArtifacts})
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
          "Shared Portfolios", "/shared-portfolios/" + id);
        // Refresh selected portfolio.
        this.props.fetchSharedPortfolio(id).then(
          () => {
            this.filterArtifacts()
            this.setSharedPortfolioLoaded(id)
          }
        )
      }
    })
  }

  getSelectedPortfolio() {
    return this.props.sharedPortfolios.find(portfolio => {
      return (portfolio.id === this.state.selectedPortfolioId)
    })
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

  runExport = async () => {
    const jwt = this.props.session.jwt
    const url = config.api.baseUrl + '/shared-portfolios/export'

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
    download(blob, 'shared portfolios.csv')
  }
}

const mapStateToProps = state => ({
  user: state.user,
  sharedPortfolios: state.sharedPortfolios,
  session: state.session,
})

const mapDispatchToProps = dispatch => ({
  fetchSharedPortfolios: () => dispatch(fetchSharedPortfolios()),
  fetchSharedPortfolio: (pId) => dispatch(fetchSharedPortfolio(pId)),
  leaveSharedPortfolio: (pId) => dispatch(leaveSharedPortfolio(pId)),
  shouldReload: (flag) => dispatch(shouldReload(flag)),
  setRedirect: path => dispatch(setRedirect(path)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SharedPortfolios)
