import React from 'react'
import { connect } from 'react-redux'
import { Button, H1 } from '@blueprintjs/core'
import ArtifactListComments from 'components/ArtifactListComments'
import PortfolioSummary from 'components/PortfolioSummary'
import 'styles/Invitation.css'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import ModalPopover from 'components/ModalPopover'
import { fetchInvitation, deleteInvitation, acceptInvitation } from 'store/invitations'

class Invitation extends React.Component {
  constructor(props) {
    super(props)

    const invitationId = props.match.params.id ? parseInt(props.match.params.id, 10) : null

    this.state = {
      redirectToDashboard: false,
      invitationId: invitationId,
    }
  }

  componentDidMount() {
    this.props.fetchInvitation(this.state.invitationId)
  }

  render() {
    if (this.state.redirectToDashboard) {
      setTimeout(
        () => {this.props.history.push(
          "/dashboard")
        },
        1000
      )
    }

    if (!this.props.invitations || this.props.invitations.length < 1 ) {
      return <div>...</div>
    }

    if (!this.getInvitation() || !this.getPortfolio()) {
      return null
    }

    return (
      <div className="eq-page">
        <div role="main" id="main-content" className="invitation">
          <div className="eq-title-section">
            <div className="invitation-actions">
              <ModalPopover
                popoverClassName="delete-modal-popover-wrapper"
                portalClassName="delete-modal-popover-container"
                title="Delete Invitation"
                content={this.renderDeleteInvitationConfirmation()}
              >
                <Button
                  className="bp3-button bp3-minimal eq-button eq-button-borderless eq-button-icon-left decline"
                >
                  Delete Invitation
                </Button>
              </ModalPopover>

              <Button
                className="bp3-button bp3-minimal eq-button eq-button-inverted accept"
                onClick={() => {
                  this.props.acceptInvitation(this.state.invitationId)
                  this.setState({redirectToDashboard: true})
                }}
              >
                Accept Invitation
              </Button>
            </div>
            <H1 className="eq-title-block">Invitation to Join {this.getName()}</H1>
          </div>
          {this.renderPortfolioSummary()}

          <ArtifactListComments
            artifacts={this.getArtifacts()}
            compare={true}
            isMutable={false}
          />
        </div>
      </div>
    )
  }

  getInvitation() {
    if (this.props.invitations[this.state.invitationId]) {
      return this.props.invitations[this.state.invitationId]
    }

    return null
  }

  getPortfolio() {
    let pId = this.getInvitation()?.sharedPortfolio?.id

    if (pId && this.props.sharedPortfolios) {
      return this.props.sharedPortfolios.find(portfolio => {
        return (portfolio.id === pId)
      })
    }

    return null
  }

  getName() {
    if (this.getPortfolio()?.name) {
      return this.getPortfolio().name
    }

    return "(Unnamed)"
  }

  getArtifacts() {
    if (this.getPortfolio()?.sharedArtifacts) {
      return this.getPortfolio().sharedArtifacts
    }

    return null
  }

  renderPortfolioSummary() {
    let portfolio = this.getPortfolio()

    let summaryDesc = {}

    if (portfolio?.grades) {
      summaryDesc['Grade Levels'] = portfolio.grades.map(grade => (
        <span className="grade" key={"grade--" + grade}>{grade}</span>
      ))
    }

    if (portfolio?.subject) {
      summaryDesc['Subject'] = portfolio.subject
    }

    if (portfolio?.topic) {
      summaryDesc['Portfolio Topic'] = portfolio.topic
    }

    if (portfolio?.plcName) {
      summaryDesc['PLC Name'] = portfolio.plcName
    }

    if (portfolio?.created_at) {
      summaryDesc['Date Created'] = new Date(
        portfolio.created_at).toLocaleDateString(
          'en-US', {year: 'numeric', month: '2-digit', day: '2-digit'
        }
      )
    }

    if (this.getArtifacts()) {
      summaryDesc['Total Artifacts'] = this.getArtifacts()?.length
    }

    if (this.getInvitation()?.from?.username) {
      summaryDesc['Invite From'] = this.getInvitation().from.username
    }

    if (this.getInvitation()?.from?.email) {
      summaryDesc['Email'] = this.getInvitation().from.email
    }

    if (portfolio?.members) {
      summaryDesc['Currently Shared with'] = (
        <React.Fragment>
          {
          portfolio.members.map(member =>
            <span className="grade">{member.username}</span>)
          }
        </React.Fragment>
      )
    }

    return (
      <PortfolioSummary
        width="full"
        columns={4}
        name={this.getName()}
        dl={summaryDesc}
      />
    )
  }

  renderDeleteInvitationConfirmation() {
    let confirmMessage = "Do you want to delete your invitation to join " + this.getName() + "?"

    return <div>
      <h2>{confirmMessage}</h2>
      <div className="actions">
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button " + POPOVER_DISMISS}
        >NO</Button>
        <Button
          className="bp3-button bp3-button bp3-minimal eq-button eq-button-inverted"
          onClick={() => {
            this.props.deleteInvitation(this.state.invitationId)
            this.setState({redirectToDashboard: true})
          }}
        >YES</Button>
      </div>
    </div>
  }
}

const mapStateToProps = state => ({
  invitations: state.invitations,
  sharedPortfolios: state.sharedPortfolios,
})

const mapDispatchToProps = dispatch => ({
  fetchInvitation: (invId) => dispatch(fetchInvitation(invId)),
  deleteInvitation: (invId) => dispatch(deleteInvitation(invId)),
  acceptInvitation: (invId) => dispatch(acceptInvitation(invId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Invitation)
