import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { fetchPortfolio, updatePortfolio, deletePortfolio } from 'store/portfolios'
import PortfolioForm from 'components/PortfolioForm'

class EditPortfolio extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: parseInt(props.match.params.id, 10),
    }
  }

  componentDidMount() {
    this.props.fetchPortfolio(this.state.id)
  }

  render() {
    if (!this.props.portfolios) {
      return null
    }

    if (this.props.session.redirect) {
      return (
        <Redirect to={this.props.session.redirect} />
      )
    }

    const selected = this.props.portfolios.find(portfolio => (
      portfolio.id === this.state.id
    ))

    if (!selected) {
      return (
        <p>
          Portfolio not found.
        </p>
      )
    }

    return (
      <PortfolioForm
        onSubmit={this.submit}
        onDelete={this.delete}
        {...selected}
      />
    )
  }

  submit = (portfolio) => {
    this.props.updatePortfolio(this.state.id, portfolio)
  }

  delete = () => {
    this.props.deletePortfolio(this.state.id)
  }
}

const mapStateToProps = state => ({
  session: state.session,
  portfolios: state.portfolios,
})

const mapDispatchToProps = dispatch => ({
  fetchPortfolio: id => dispatch(fetchPortfolio(id)),
  updatePortfolio: (id, portfolio) => dispatch(updatePortfolio(id, portfolio)),
  deletePortfolio: id => dispatch(deletePortfolio(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditPortfolio)
