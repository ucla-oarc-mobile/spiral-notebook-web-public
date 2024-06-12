import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { fetchSharedPortfolio, updateSharedPortfolio, deleteSharedPortfolio } from 'store/shared-portfolios'
import SharedPortfolioForm from 'components/SharedPortfolioForm'

class EditSharedPortfolio extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: parseInt(props.match.params.id, 10),
    }
  }

  componentDidMount() {
    this.props.fetchSharedPortfolio(this.state.id)
  }

  render() {
    if (!this.props.sharedPortfolios) {
      return null
    }

    if (this.props.session.redirect) {
      return (
        <Redirect to={this.props.session.redirect} />
      )
    }

    const selected = this.props.sharedPortfolios.find(portfolio => (
      portfolio.id === this.state.id
    ))

    if (!selected || (
      this.props.user.role.type !== 'researcher' &&
      this.props.user.id !== selected.owner.id
    )) {
      return (
        <p>
          Shared portfolio not found.
        </p>
      )
    }

    return (
      <SharedPortfolioForm
        onSubmit={this.submit}
        onDelete={selected.sharedArtifacts.length === 0 ? this.delete : null}
        {...selected}
      />
    )
  }

  submit = (portfolio) => {
    this.props.updateSharedPortfolio(this.state.id, portfolio)
  }

  delete = () => {
    this.props.deleteSharedPortfolio(this.state.id)
  }
}

const mapStateToProps = state => ({
  user: state.user,
  sharedPortfolios: state.sharedPortfolios,
  session: state.session
})

const mapDispatchToProps = dispatch => ({
  fetchSharedPortfolio: id => dispatch(fetchSharedPortfolio(id)),
  updateSharedPortfolio: (id, portfolio) => dispatch(updateSharedPortfolio(id, portfolio)),
  deleteSharedPortfolio: id => dispatch(deleteSharedPortfolio(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditSharedPortfolio)
