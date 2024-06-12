import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { createComment, editComment, deleteComment } from 'store/shared-artifacts'
import dateFormat from 'dateformat'
import {Button, FormGroup, H3, TextArea} from '@blueprintjs/core'
import ModalPopover from 'components/ModalPopover'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import { fetchSharedPortfolio } from 'store/shared-portfolios'

class Comments extends React.Component {
  constructor() {
    super()

    this.state = {
      editing: null,
      editComment: null,
      newComment: null,
    }
  }

  render() {
    if (!this.props.allowNewComments && !this.props.comments?.length) {
      return null
    }

    return <div key="asdfg" className="eq-artifact-comments">
      <H3>Comments</H3>
      {this.props.comments.map(comment => this.renderComment(comment))}
      {this.renderNewCommentForm()}
    </div>
  }

  renderComment(comment) {
    let editable = this.state.editing !== null && this.state.editing !== undefined
    editable = editable && this.state.editing === comment.id
    editable = editable && this.props.user.id === comment.owner

    let allowUserCommentEdit = (this.props.user.id === comment.owner)
      && this.props.allowNewComments

    if (editable)  {
      return this.renderEditCommentForm(comment)
    } else {
      return this.renderReadOnlyComment(comment, allowUserCommentEdit)
    }
  }

  renderReadOnlyComment(comment, isEditable) {
    let editLink = null
    if (isEditable) {
      editLink = (
        <Button
          className="eq-button edit"
          onClick={(e) => {
            this.setState({editing: comment.id})
          }}
        >Edit</Button>
      )
    }

    return <div
      className="eq-artifact-comment"
      key={"comment--" + comment.sharedArtifact + "--" + comment.id}
    >
      <div className="eq-artifact-comment-header">
        <div className="eq-artifact-comment-name">{comment.username}</div>
        <div className="eq-artifact-comment-date">{dateFormat(comment.updated_at, 'mm/dd/yy')}</div>
      </div>
      <div className="eq-artifact-comment-body">{comment.text}</div>
      {editLink}
    </div>
  }

  renderEditCommentForm(comment) {
    if (!this.props.allowNewComments) {
      return null;
    }

    let value = ''
    if (this.state.editComment === null || this.state.editComment === undefined) {
      value = comment.text
    } else {
      value = this.state.editComment
    }

    return <div
        className="eq-artifact-comment eq-artifact-comment-form eq-artifact-comment-edit"
        key={"comment--" + comment.sharedArtifact + "--" + comment.id}
      >
      <FormGroup label={this.limitLabel(value)}>
        <TextArea
          name="edit_comment"
          growVertically={false}
          large={true}
          placeholder="Write a comment..."
          onChange={(e) => this.setState({editComment: e.currentTarget.value})}
          value={value ? value : ''}
          autoFocus={true}
          maxLength={2500}
        />
        <div className="eq-artifact-comment-form-actions">
          <ModalPopover
            popoverClassName="delete-modal-popover-wrapper"
            portalClassName="delete-modal-popover-container"
            title="Delete Artifact Comment"
            content={this.renderDeleteCommentConfirmation(comment.id)}
          >
            <Button
              className="eq-button delete"
            >Delete</Button>
          </ModalPopover>

          <Button
            className="bp3-button bp3-minimal eq-button eq-square-button small cancel"
            onClick={() => this.setState({editing: null, editComment: null})}
          >Cancel</Button>
          <Button
            className={"bp3-button bp3-minimal eq-button eq-button-inverted eq-square-button small save"}
            onClick={(e) => {
              this.props.editComment(
                this.props.portfolioId,
                this.props.artifact.id,
                comment.id,
                this.state.editComment.slice()
              )
              this.setState({editing: null, editComment: null})
            }}
          >Save</Button>
        </div>
      </FormGroup>
    </div>
  }

  renderNewCommentForm() {
    if (!this.props.allowNewComments) {
      return null;
    }

    let cancel = null
    if (this.state.newComment) {
      cancel = <Button
        className="bp3-button bp3-minimal eq-button eq-square-button small cancel"
        onClick={() => this.setState({newComment: null})}
      >Cancel</Button>
    }

    return <div
      className="eq-artifact-comment eq-artifact-comment-form eq-artifact-comment-reply"
    >
      <FormGroup label={this.limitLabel(this.state.newComment)}>
        <TextArea
          name="new_comment"
          growVertically={false}
          large={true}
          placeholder="Write a comment..."
          onChange={(e) => this.setState({newComment: e.currentTarget.value})}
          value={this.state.newComment ? this.state.newComment : ''}
          maxLength={2500}
        />
        <div className="eq-artifact-comment-form-actions">
          {cancel}
          <Button
            className={"bp3-button bp3-minimal eq-button eq-square-button small " + ((this.state.newComment) ? " edit eq-button-inverted": "save")}
            disabled={!this.state.newComment}
            onClick={(e) => {
              this.props.createComment(
                this.props.artifact.id,
                this.state.newComment.slice()
              )

              this.setState({newComment: null},
                () => this.updateSharedPortfolio())
            }}
          >Save</Button>
        </div>
      </FormGroup>
    </div>
  }

  renderDeleteCommentConfirmation(commentId) {
    let confirmMessage = "Are you sure you want to delete this comment?"

    return <div>
      <h2>{confirmMessage}</h2>
      <div className="actions">
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button " + POPOVER_DISMISS}
        >NO</Button>
        <Button
          className="bp3-button bp3-button bp3-minimal eq-button eq-button-inverted"
          onClick={() => {
            this.props.deleteComment(commentId)
            this.setState({editing: null, editComment: null},
              () => this.updateSharedPortfolio())
          }}
        >YES</Button>
      </div>
    </div>
  }

  updateSharedPortfolio() {
    setTimeout(
      () => {this.props.fetchSharedPortfolio(this.props.portfolioId)},
      1000
    )
  }

  limitLabel(text) {
    const current = (text || '').length
    return current + '/2500 characters used'
  }
}

Comments.propTypes = {

  portfolioId: PropTypes.number.isRequired,
  artifact: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
}

const mapStateToProps = state => {
  return {user: state.user, sharedArtifacts: state.sharedArtifacts}
}

const mapDispatchToProps = dispatch => ({
  createComment: (aId, comment) => dispatch(createComment(aId, comment)),
  editComment: (pId, aId, cId, comment) => dispatch(editComment(pId, aId, cId, comment)),
  deleteComment: (cId) => dispatch(deleteComment(cId)),
  fetchSharedPortfolio: (pId) => dispatch(fetchSharedPortfolio(pId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Comments)

