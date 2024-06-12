import React from 'react'
import { connect } from 'react-redux'
import 'styles/ManageUsers.css'

import { fetchUser } from 'store/user'
import { fetchUsers, createUser, setUserActive } from 'store/users'
import UserTable from 'components/UserTable'

class ManageUsers extends React.Component {
  componentDidMount() {
    if (!this.props.user) {
      this.props.fetchUser()
    }

    this.props.fetchUsers()
  }

  render() {
    if (!this.props.user || !this.props.users) {
      return null
    }

    if (this.props.user.role.type !== 'researcher') {
      return (
        <p>
          Only researchers can manage users.
        </p>
      )
    }

    return (
      <UserTable
        currentUserId={this.props.user.id}
        users={this.props.users}
        onSwitchStatus={this.props.setUserActive}
        onCreateUser={this.props.createUser}
      />
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  users: state.users,
})

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(fetchUser()),
  fetchUsers: () => dispatch(fetchUsers()),
  createUser: (email, username, roleId) => dispatch(createUser(email, username, roleId)),
  setUserActive: (id, active) => dispatch(setUserActive(id, active)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers)
