import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { fetchPortfolio } from 'store/portfolios'
import { createSharedPortfolio } from 'store/shared-portfolios'
import SharedPortfolioForm from 'components/SharedPortfolioForm'

class NewSharedPortfolio extends React.Component {
  componentDidMount() {
    // Fetch the template (hardcoded as portfolio 1 for now)
    this.props.fetchPortfolio(1)
  }

  render() {
    if (!this.props.portfolios) {
      return null
    }

    else if (this.props.session.redirect) {
      return (
        <Redirect to={this.props.session.redirect} />
      )
    }

    else if (!['plc_lead', 'researcher'].includes(this.props.user.role.type)) {
      return (
        <p>
          You do not have permission to access this page.
        </p>
      )
    }

    const selected = this.props.portfolios.find(portfolio => (
      portfolio.id === 1
    ))

    if (!selected) {
      return (
        <p>
          Portfolio template not found.
        </p>
      )
    }

    return (
      <SharedPortfolioForm
        onSubmit={this.submit}
        templateStructure={selected.structure}
        redirectId={(this.props.location?.state?.id) ? this.props.location.state.id : null}
      />
    )
  }

  submit = (portfolio) => {
    this.props.createSharedPortfolio(portfolio)
  }
}

const mapStateToProps = state => ({
  portfolios: state.portfolios,
  session: state.session,
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  fetchPortfolio: id => dispatch(fetchPortfolio(id)),
  createSharedPortfolio: portfolio => dispatch(createSharedPortfolio(portfolio)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewSharedPortfolio)
