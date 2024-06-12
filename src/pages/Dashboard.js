import React from 'react'
import { connect } from 'react-redux'
import { H1 } from '@blueprintjs/core'

import { fetchUser } from 'store/user'
import { fetchMyPortfolios, createPortfolio } from 'store/portfolios'
import { fetchSharedPortfolios } from 'store/shared-portfolios'
import { fetchInvitations } from 'store/invitations'
import PortfolioTable from 'components/PortfolioTable'
import PortfolioSummary from 'components/PortfolioSummary'

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchUser()
    this.props.fetchMyPortfolios()
    this.props.fetchSharedPortfolios()
    this.props.fetchInvitations()
  }

  render() {
    if (!this.props.user) {
      return null
    }

    return (
      <div role="main" id="main-content">
        {this.renderSummary()}
        {this.renderMyPortfolioTable()}
        {this.renderSharedPortfolioTable()}
        {this.renderInvitationsTable()}
      </div>
    )
  }

  renderSummary() {
    if (!this.props.sharedPortfolios || this.props.user.role.type !== 'researcher') {
      return null
    }

    let artifactCount = 0
    let commentCount = 0
    let teacherIds = {}

    this.props.sharedPortfolios.forEach((sharedPortfolio) => {
      artifactCount += sharedPortfolio.sharedArtifacts.length
      commentCount += sharedPortfolio.commentCount
      sharedPortfolio.members.forEach((user) => {
        teacherIds[user.id] = true
      })
    })

    const dl = {
      Portfolios: this.props.sharedPortfolios.length,
      Artifacts: artifactCount,
      Comments: commentCount,
      Teachers: Object.keys(teacherIds).length,
    }

    return (
      <div className="researcher-summary">
        <H1 style={{ textAlign: 'center' }}>
          Teacher Portfolio Summary
        </H1>
        <PortfolioSummary columns={4} dl={dl} />
      </div>
    )
  }

  renderMyPortfolioTable() {
    if (!this.props.portfolios || this.props.user.role.type === 'researcher') {
      return null
    }

    return <PortfolioTable
      type="my"
      portfolios={this.props.portfolios}
      onSubmit={this.props.createPortfolio}
    />
  }

  renderSharedPortfolioTable() {
    if (!this.props.sharedPortfolios || this.props.sharedPortfolios.length < 1) {
      return null
    }

    return <PortfolioTable
      type="shared"
      portfolios={this.props.sharedPortfolios}
    />
  }

  renderInvitationsTable() {
    if (!this.props.invitations || this.props.invitations.length < 1) {
      return null
    }

    return <PortfolioTable
      type="invitations"
      portfolios={this.props.invitations}
    />
  }
}

const mapStateToProps = state => ({
  user: state.user,
  portfolios: state.portfolios,
  sharedPortfolios: state.sharedPortfolios,
  invitations: state.invitations,
})

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(fetchUser()),
  fetchMyPortfolios: () => dispatch(fetchMyPortfolios()),
  fetchSharedPortfolios: () => dispatch(fetchSharedPortfolios()),
  fetchInvitations: () => dispatch(fetchInvitations()),
  createPortfolio: (portfolio) => dispatch(createPortfolio(portfolio)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
