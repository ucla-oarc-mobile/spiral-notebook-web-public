import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ModalPopover from './ModalPopover'
import { Button, FormGroup, H2, InputGroup } from '@blueprintjs/core'
import 'styles/EditParticipants.css'
import { createNewUserInvitation } from 'store/invitations'
import { fetchSharedPortfolioMembers, destroySharedPortfolioMembers, inviteSharedPortfolioMember, removeSharedPortfolioMember, deleteSharedPortfolioPendingInvitation } from 'store/shared-portfolio-members'
import userSort from 'helpers/userSort'

class EditParticipants extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      nonMemberEmail: null,
      memberEmail: null,
      deleteUser: null,
    }
  }

  componentDidMount() {
    this.props.fetchSharedPortfolioMembers(this.props.sharedPortfolio.id)
  }

  componentWillUnmount() {
    this.props.destroySharedPortfolioMembers()
  }

  render() {

    if (!this.props.sharedPortfolioMembers) {
      return null
    }

    return <ModalPopover
      popoverClassName="edit-participants-modal-popover-wrapper"
      portalClassName="edit-participants-modal-popover-container"
      title="Edit Participants"
      content={this.renderParticipantList()}
    >
      <Button
        className="eq-button eq-square-button"
        style={{ minHeight: 'auto', marginTop: '5px', padding: '10px' }}
        onClick={() => this.props.fetchSharedPortfolioMembers(this.props.sharedPortfolio.id)}
      >Edit Participants</Button>
    </ModalPopover>
  }

  renderParticipantList() {
    return <div className="edit-participants-content">
      <div className="edit-participants-columns">
        <div className="edit-participants-column">
          <H2>Add Participants to Portfolio</H2>
          {this.renderSearchNonMembers()}
          {this.renderUserList()}
        </div>
        <div className="edit-participants-column">
          <H2>Portfolio Participants</H2>
          {this.renderSearchMembers()}
          {this.renderMemberList()}
        </div>
      </div>
      {this.renderActions()}
    </div>
  }

  renderSearchNonMembers() {
    return this.renderSearchUser(this.state.nonMemberEmail, (e) => {
      this.setState({
        nonMemberEmail: e.currentTarget.value,
      })
    })
  }

  renderSearchMembers() {
    return this.renderSearchUser(this.state.memberEmail, (e) => {
      this.setState({
        memberEmail: e.currentTarget.value,
      })
    })
  }

  renderInviteNewUser() {
    let nonMemberEmail = this.state.nonMemberEmail

    // w3c email spec with a single alteration. User + instead of * for final part of pattern.
    let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/g


    if (!nonMemberEmail || !nonMemberEmail.match(emailPattern)) {
      return <div className={"edit-participants-user-list"}>
        Please enter a valid email address to invite a new user.
      </div>
    }

    return <div className={"edit-participants-user-list"}>
      <Button
        className="edit-participants-user eq-button-plain"
        key={"invite-participants-user--" + nonMemberEmail}
        onClick={() => {
          this.props.createNewUserInvitation(nonMemberEmail, this.props.sharedPortfolio.id)
          this.setState({ nonMemberEmail: null })
        }}>
          <div className="user-info">
            <div className="user-name">Invite</div>
            <div className="user-email">{nonMemberEmail}</div>
          </div>
      </Button>
    </div>
  }

  renderUserList() {
    let nonMembers = this.getFilteredNonMembers()

    if (nonMembers.length < 1) {
      return this.renderInviteNewUser()
    }

    return <div className={"edit-participants-user-list " + ((nonMembers.length > 4) ? "add-border": "")}>
      {nonMembers.map(user => {
        return <Button
          className="edit-participants-user eq-button-plain"
          key={"edit-participants-user--" + user.email}
          onClick={() => {
            this.props.inviteSharedPortfolioMember(user.id, this.props.sharedPortfolio.id)
          }}>
            <div className="user-info">
              <div className="user-name">{user.username}</div>
              <div className="user-email">{user.email}</div>
            </div>
        </Button>
      })}
    </div>
  }

  renderMemberList() {
    let members = this.getFilteredMembers()

    return <div className={"edit-participants-user-list" + ((members.length > 4) ? " add-border": "")}>
      {members.map(user => {
        let pending = null
        if (user.pending) {
          pending = <span className="pending-text"> (Pending)</span>
        }

        return <div
          className={"edit-participants-user" + ((pending) ? " pending": "")}
          key={"edit-participants-user--" + user.email}>
            <div className="user-info">
              <div className="user-name">{user.username}{pending}</div>
              <div className="user-email">{user.email}</div>
          </div>
          <button className="remove-user eq-delete"
            onClick={(e) => {
              this.setState({deleteUser: user})
            }}
          >
            <span>Remove {user.email} from shared portfolio.</span>
          </button>
        </div>
      })}
    </div>
  }

  getNonMembers() {
    if (this.props.sharedPortfolioMembers?.nonMembers) {
      return this.props.sharedPortfolioMembers.nonMembers.filter(
        member => member.id !== this.props.sharedPortfolio.owner.id
      ).sort(userSort)
    }

    return []
  }

  filterUsers(value, userList) {
    value = value.toLowerCase()
    return userList.filter(user => {
      let target = Object.values(user).join(" ").toLowerCase()
      return target.includes(value)
    }).sort(userSort)
  }

  getFilteredNonMembers() {
    let value = this.state.nonMemberEmail

    if (!value) {
      return this.getNonMembers()
    }

    return this.filterUsers(value, this.getNonMembers())
  }

  getMembers() {
    let members = []
    if (this.props.sharedPortfolioMembers?.pending) {
      this.props.sharedPortfolioMembers.pending.forEach(member => {
        member['pending'] = true
        members.push(member)
      })
    }

    if (this.props.sharedPortfolioMembers?.members) {
      members = members.concat(this.props.sharedPortfolioMembers.members)
    }

    return members.filter(
      member => member.id !== this.props.sharedPortfolio.owner.id
    ).sort(userSort)
  }

  getFilteredMembers() {
    let value = this.state.memberEmail

    if (!value) {
      return this.getMembers()
    }

    return this.filterUsers(value, this.getMembers())
  }

  renderSearchUser(value, onChange) {
    return <form>
      <FormGroup
        labelFor="searchParticipant"
        label='Enter email address of user'
        className="edit-participant-textfield"
      >
        <InputGroup
            type='email'
            id="searchParticipant"
            name="searchParticipant"
            placeholder="Enter email address of user"
            onChange={(e) => {onChange(e)}}
            value={(value) ? value : ''}
            fill
        />
        <div
          className="edit-participants-search-button"></div>
      </FormGroup>
    </form>
  }

  searchUserSubmit = (event) => {
    event.preventDefault()
    let email = event.currentTarget?.searchParticipant?.value

    if (!email) {
      alert("Email is required")
      return
    }

    let matchMember = this.getMembers().find(user => user.email === email)

    if (matchMember) {
      alert(email + " is already a member of this shared portfolio.")
      return
    }

    let matchUser = this.getNonMembers().find(user => user.email === email)

    if (matchUser) {
      this.props.inviteSharedPortfolioMember(matchUser.id, this.props.sharedPortfolio.id)
    } else {
      this.props.createNewUserInvitation(email, this.props.sharedPortfolio.id)
    }

    this.setState({nonMemberEmail: null})
  }

  renderActions() {
    if (!this.state.deleteUser) {
      return null
    }

    return <div className="delete-member-actions-wrapper">
      <div className="edit-participants-actions delete-member-actions">
        <div className="ep-description">Are you sure you would like to delete {this.state.deleteUser.username}</div>
        <Button
          className={"bp3-button bp3-minimal eq-button"}
          onClick={(e) => {
            e.preventDefault()
            this.setState({deleteUser: null})
           }}
          >
            NO
        </Button>
        <Button
          className="bp3-button bp3-minimal eq-button eq-button-inverted"
          type="submit"
          onClick={(e) => {
            e.preventDefault()

            if (this.state.deleteUser?.pending && this.state.deleteUser.invitationId) {
              this.props.deleteSharedPortfolioPendingInvitation(this.state.deleteUser.invitationId)
            } else {
              this.props.removeSharedPortfolioMember(this.props.sharedPortfolio.id, this.state.deleteUser.id)
            }

            this.setState({deleteUser: null})
          }}
        >
          Yes
        </Button>
      </div>
    </div>
  }
}

EditParticipants.propTypes = {
  sharedPortfolio: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  user: state.user,
  sharedPortfolioMembers: state.sharedPortfolioMembers,
})

const mapDispatchToProps = dispatch => ({
  removeSharedPortfolioMember: (uId, pId) => dispatch(removeSharedPortfolioMember(uId, pId)),
  inviteSharedPortfolioMember: (uId, pId) => dispatch(inviteSharedPortfolioMember(uId, pId)),
  deleteSharedPortfolioPendingInvitation: (id) => dispatch(deleteSharedPortfolioPendingInvitation(id)),
  createNewUserInvitation: (email, pId) => dispatch(createNewUserInvitation(email, pId)),
  fetchSharedPortfolioMembers: (pId) => dispatch(fetchSharedPortfolioMembers(pId)),
  destroySharedPortfolioMembers: () => dispatch(destroySharedPortfolioMembers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditParticipants)
