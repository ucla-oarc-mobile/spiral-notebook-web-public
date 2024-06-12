import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ArtifactView from './ArtifactView'
import { fetchArtifact, deleteArtifact } from 'store/artifacts'
import { Link } from 'react-router-dom'
import ModalPopover from './ModalPopover'
import { Button } from '@blueprintjs/core'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import { shouldReload } from 'store/session'

class Artifact extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      artifact: null
    }
  }

  componentDidMount() {
    this.props.fetchArtifact(this.props.aId)
  }

  render() {
    if (!this.props.artifacts) {
      return null
    }

    if (!this.props.artifacts[this.props.aId]) {
      return null
    }

    return <ArtifactView
      artifact={this.props.artifacts[this.props.aId]}
      headerRight={this.renderCompleteArtifactAction()}
      footer={this.renderEditActions()}
      isCompared={this.props.isCompared}
    />
  }

  getArtifact() {
    return this.props.artifacts[this.props.aId]
  }

  renderDeleteArtifactAction() {
    if (this.props.user.role.type === 'researcher') {
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
    let artifactName = Artifact.defaultName

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
            this.props.deleteArtifact(this.getArtifact()).then(
              () => this.props.shouldReload(true)
            )
            this.setState({artifact: null})
          }}
        >YES</Button>
      </div>
    </div>
  }

  renderCompleteArtifactAction() {
    if (this.props.user.role.type === 'researcher') {
      return null
    }

    if (this.props.isMutable && !this.props.isCompared && this.getArtifact()['parkingLot']) {
      let pId = this.getArtifact().portfolio.id
      let aId = this.getArtifact().id
      return <div className="artifact-header-right">
        <Link
          to={'/my-portfolios/' + pId + '/artifacts/' + aId + '/edit'}
          className="bp3-button bp3-minimal eq-button link-button"
        >
          Complete Artifact
        </Link>
        <span>{this.renderDeleteArtifactAction()}</span>
      </div>
    }
  }

  renderEditActions() {
    if (this.props.user.role.type === 'researcher') {
      return null
    }

    if (this.props.isMutable && !this.props.isCompared && !this.getArtifact()['parkingLot']) {
      let pId = this.getArtifact().portfolio.id
      let aId = this.getArtifact().id
      return <div className="edit-actions">
        <Link
          to={'/my-portfolios/' + pId + '/artifacts/' + aId + '/edit'}
          className="bp3-button bp3-minimal eq-button link-button"
        >
          EDIT
        </Link>

        <Link
          to={'/my-portfolios/' + pId + '/artifacts/' + aId + '/copy'}
          className="bp3-button bp3-minimal eq-button link-button eq-button-inverted"
        >
          COPY TO
        </Link>
        <span>{this.renderDeleteArtifactAction()}</span>
      </div>
    }
  }
}

Artifact.defaultName = "(Unnamed)"

Artifact.propTypes = {
  aId: PropTypes.number,
  isMutable: PropTypes.bool,
  isCompared: PropTypes.bool,
  shared: PropTypes.bool,
}

Artifact.defaultProps = {
  isMutable: false,
  isCompared: false,
  shared: false,
}

const mapStateToProps = state => ({
  artifacts: state.artifacts,
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  fetchArtifact: (aId) => dispatch(fetchArtifact(aId)),
  deleteArtifact: (artifact) => dispatch(deleteArtifact(artifact)),
  shouldReload: (flag) => dispatch(shouldReload(flag)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Artifact)
