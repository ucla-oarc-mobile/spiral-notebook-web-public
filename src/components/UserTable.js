import React from 'react'
import PropTypes from 'prop-types'
import { H1, Switch, Spinner, Button, FormGroup, HTMLSelect, H2 } from '@blueprintjs/core'
import ReactTable from 'react-table-v6'
import ModalPopover from './ModalPopover'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import Email from './forms/fields/Email'
import Textfield from './Textfield'
import 'styles/selectfields.css'
import 'styles/PortfolioTable.css'

class UserTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.getDefaultState()
  }

  render() {
    const columns = [{
      Header: 'Name',
      accessor: 'username',
      minWidth: 100,
    }, {
      Header: 'Email',
      accessor: 'email',
      minWidth: 100,
    }, {
      Header: 'Role',
      accessor: 'role.name',
      minWidth: 100,
    }, {
      Header: 'Active',
      accessor: 'blocked',
      Cell: this.renderActive,
      minWidth: 68,
    }]
    return (
      <div className="eq-manage-users">
        <div role="main" id="main-content" className="PortfolioTable">
          <div className="eq-title-section" style={{ position: 'relative' }}>
            <H1 className="eq-title-block">
              Manage Users
            </H1>

            <ModalPopover
              popoverClassName="create-user-modal-popover-wrapper"
              portalClassName="create-user-modal-popover-container"
              title="Create User"
              content={this.renderCreateUserDialog()}
            >
              <Button
                className="bp3-button bp3-minimal eq-button eq-button-inverted"
                style={{ position: 'absolute', right: 0, top: 0 }}
                onClick={this.openDialog}
              >
                Create New User
              </Button>
            </ModalPopover>
          </div>

          <ReactTable
            className="eq-react-table"
            columns={columns}
            data={this.props.users}
            showPagination={false}
            defaultPageSize={this.props.users.length}
            minRows={0}
          />
        </div>
      </div>
    )
  }

  renderCreateUserDialog() {
    if (this.state.loading) {
      return <div className="eq-loading">
        <H2>Processing new user request.</H2>
        <Spinner></Spinner>
      </div>
    }

    let errorMsg = null
    if (this.state.errorMsg) {
      errorMsg = <div className="field-error">
        Error: {this.state.errorMsg}
      </div>
    }

    return <div>
      <div className="actions">
        <form onSubmit={this.submit}>
          {errorMsg}
          <FormGroup
            labelFor={this.state.roleId.name}
            label={this.state.roleId.text}
          >
            {(this.state.roleId.error) ? <div className="field-error">
                {this.state.roleId.error}
              </div> : null
            }
            <HTMLSelect
              name={this.state.roleId.name}
              id={this.state.roleId.name}
              className="eq-select"
              iconProps={{ icon: 'chevron-down', color:  "#2774AE"}}
              defaultValue={0}
              onChange={this.changeInput}
              options={this.state.roleId.options}
              required={true}
            />
          </FormGroup>
          <Textfield
            name={this.state.username.name}
            label={this.state.username.text}
            onChange={this.changeInput}
            defaultValue={this.state.username.value}
            error={this.state.username.error}
            required={true}
          />
          <Email
            name={this.state.email.name}
            label={this.state.email.text}
            onChange={this.changeInput}
            defaultValue={this.state.email.value}
            error={this.state.email.error}
            required={true}
          />
          {this.renderActions()}
        </form>
      </div>
    </div>
  }

  getDefaultState() {
    return {
      errorMsg: null,
      loading: false,
      username: {
        name: 'username',
        type: 'text',
        text: 'User Name',
        value: null,
        error: null
      },
      email: {
        name: 'email',
        type: 'email',
        text: 'Email',
        value: null,
        error: null
      },
      roleId: {
        name: 'roleId',
        text: 'Role',
        value: 1,
        defaultValue: 1,
        error: null,
        options: [
          {value: 1, label: 'Teacher'},
          {value: 3, label: 'PLC Lead'},
          {value: 4, label: 'Researcher'}
        ]
      },
    }
  }

  renderActions() {
    return <div className="create-user-actions-wrapper">
        <div className="create-user-actions delete-member-actions">
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button " + POPOVER_DISMISS}
          onClick={() => this.setState(this.getDefaultState())}
        >Cancel</Button>
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button eq-button-inverted"}
          type="submit"
        >Create User</Button>
      </div>
    </div>
  }

  changeInput = (event) => {
    const name = event.currentTarget.name
    const val = event.currentTarget.value
    let fieldState = this.state[name]

    fieldState.value = val
    this.setState({name: fieldState})
  }

  submit = (event)  => {
    let formErrors = false

    let username = {...this.state.username}
    if (!username.value) {
      username.error = (<div>
        Field <strong>{username.text}</strong> is required.
      </div>)
      this.setState({username: username})
      formErrors = true
    }

    let email = {...this.state.email}
    if (!Email.validateField(email, true)) {
      this.setState({email: email})
      formErrors = true
    }

    let roleId = {...this.state.roleId}
    let roleFound = roleId.options.find(
      (option) => {
        return option.value ===  parseInt(roleId.value)}
    )?.value

    if (!Number.isInteger(roleFound)) {
      roleId.error = (<div>
        Field <strong>{roleId.text}</strong> with value <strong>{roleId.value}</strong> is invalid.
      </div>)
      roleId.value = roleId.defaultValue
      this.setState({roleId: roleId})
      formErrors = true
    }

    event.preventDefault()
    if (!formErrors) {
      this.setState(
        {
          errorMsg: null,
          loading: true,
        },
        () => {this.props.onCreateUser(
          email.value, username.value, parseInt(roleId.value)
        ).then(
          (success) => {
            if (success) {
              setTimeout(
                window.location.reload(),
                2000
              )
            } else {
              this.setState({
                errorMsg: "User creation failed. Please try again.",
                loading: false,
              })
            }
          }
        )}
      )
    }
  }

  renderActive = (props) => {
    if (props.value === null) {
      return (
        <Spinner intent="primary" />
      )
    }

    return (
      <Switch
        large
        disabled={props.original.id === this.props.currentUserId}
        defaultChecked={!props.value}
        onChange={(event) => this.props.onSwitchStatus(props.original.id, event.currentTarget.checked)}
      />
    )
  }
}

UserTable.propTypes = {
  currentUserId: PropTypes.number.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSwitchStatus: PropTypes.func.isRequired,
  onCreateUser: PropTypes.func.isRequired,
}

export default UserTable
