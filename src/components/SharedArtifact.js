import React from 'react'
import { connect } from 'react-redux'
import { fetchSharedArtifact, deleteSharedArtifact } from 'store/shared-artifacts'
import { fetchAvailableReactions } from 'store/available-reactions'
import PropTypes from 'prop-types'
import ArtifactView from './ArtifactView'
import Reactions from './Reactions'
import Comments from './Comments'
import { Link } from 'react-router-dom'
import ModalPopover from './ModalPopover'
import { Button } from '@blueprintjs/core'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import { shouldReload } from 'store/session'

class SharedArtifact extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      artifact: null
    }
  }

  componentDidMount() {
    this.props.fetchSharedArtifact(this.props.aId)
    this.props.fetchAvailableReactions()
  }

  render() {
    if (!this.props.sharedArtifacts) {
      return null
    }

    if (!this.props.sharedArtifacts[this.props.aId]) {
      return null
    }

    return <ArtifactView
      artifact={this.getArtifact()}
      headerRight={this.renderReactions()}
      footer={this.renderFooter()}
      isCompared={this.props.isCompared}
      shared
    />
  }

  getArtifact() {
    return this.props.sharedArtifacts[this.props.aId]
  }

  renderFooter() {
    return <React.Fragment>
      {this.renderComments()}
      {this.renderEditActions()}
    </React.Fragment>
  }

  renderEditActions() {
    if (this.props.isMutable && !this.props.isCompared && !this.getArtifact()['parkingLot']) {
      let pId = this.getArtifact().sharedPortfolio.id
      let aId = this.getArtifact().id
      return <div className="edit-actions">
        <Link
          to={'/shared-portfolios/' + pId + '/artifacts/' + aId + '/edit'}
          className="bp3-button bp3-minimal eq-button link-button"
        >
          EDIT
        </Link>

        <Link
          to={'/shared-portfolios/' + pId + '/artifacts/' + aId + '/copy'}
          className="bp3-button bp3-minimal eq-button link-button eq-button-inverted"
        >
          COPY TO
        </Link>

        <span>{this.renderDeleteArtifactAction()}</span>
      </div>
    }
  }

  /**
   * This is a placeholder for comments that will be added to some artifacts.
   *
   * @returns null
   */
  renderComments() {
    if (this.props.isCompared) {
      return null
    }

    if (!this.props.sharedArtifacts[this.props.aId].comments) {
      return null
    }

    return <Comments
      portfolioId={this.props.sharedArtifacts[this.props.aId].sharedPortfolio.id}
      artifact={this.props.sharedArtifacts[this.props.aId]}
      comments={this.props.sharedArtifacts[this.props.aId].comments}
      username='fmartinez'
      allowNewComments={this.props.isMutable}
    />
  }

   renderDeleteArtifactAction() {
    if (this.getArtifact().reactions?.length || this.getArtifact().comments?.length) {
      return null
    }

    return <ModalPopover
      popoverClassName="delete-modal-popover-wrapper"
      portalClassName="delete-modal-popover-container"
      title="Delete Artifact"
      content={this.renderDeleteArtifactConfirmation()}
    >
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-icon-left decline artifact-header-right"
      >
        Delete Artifact
      </Button>
    </ModalPopover>
  }

  renderDeleteArtifactConfirmation() {
    let artifactName = SharedArtifact.defaultName

    if (this.getArtifact()?.responses?.artifactName) {
      artifactName = this.getArtifact().responses.artifactName
    }
    let confirmMessage = "Do you want to delete " + artifactName + "?"

    return <div>
      <h2>{confirmMessage}</h2>
      <div className="actions">
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button " + POPOVER_DISMISS}
        >NO</Button>
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button eq-button-inverted " + POPOVER_DISMISS}
          onClick={() => {
              this.props.deleteSharedArtifact(this.getArtifact()).then(
                () => this.props.shouldReload(true)
              )
              this.setState({artifact: null})
          }}
        >YES</Button>
      </div>
    </div>
  }

  renderReactions() {
    if (this.props.isCompared) {
      return null
    }

    if (!this.props.availableReactions) {
      return null
    }

    return <Reactions
      reactions={this.getArtifact().reactions}
      availableReactions={this.props.availableReactions}
      aId={this.getArtifact().id}
      allowNewReactions={this.props.isMutable}
    />
  }
}

SharedArtifact.defaultName = "(Unnamed)"

SharedArtifact.propTypes = {
  aId: PropTypes.number.isRequired,
  isMutable: PropTypes.bool,
  isCompared: PropTypes.bool,
  store: PropTypes.object
}

SharedArtifact.defaultProps = {
  isMutable: false,
  isCompared: false,
}

const mapStateToProps = state => {
  return {
    sharedArtifacts: state.sharedArtifacts,
    availableReactions: state.availableReactions
  }
}

const mapDispatchToProps = dispatch => ({
  fetchSharedArtifact: (aId) => dispatch(fetchSharedArtifact(aId)),
  fetchAvailableReactions: () => dispatch(fetchAvailableReactions()),
  deleteSharedArtifact: (artifact) => dispatch(deleteSharedArtifact(artifact)),
  shouldReload: (flag) => dispatch(shouldReload(flag)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SharedArtifact)
