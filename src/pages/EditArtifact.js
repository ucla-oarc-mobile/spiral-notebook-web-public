import React from 'react'
import { connect } from 'react-redux'
import { Button, H1 } from '@blueprintjs/core'
import dateFormat from 'dateformat'

import config from 'config'
import { fetchArtifact, editArtifact, deleteArtifact, removeArtifact } from 'store/artifacts'
import Artifact from 'components/Artifact'
import ArtifactField from 'components/forms/ArtifactField'
import Uploads from 'components/forms/Uploads'
import ModalPopover from 'components/ModalPopover'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'

import 'styles/EditArtifact.css'

class EditArtifact extends React.Component {
  // Submission types.
  SAVE_TO_PARKING_LOT = 1
  SUBMIT_TO_PORTFOLIO = 2
  SAVE_COMPLETED_ARTIFACT = 3

  constructor(props) {
    super(props)

    const portfolioId = props.match.params.id ? parseInt(props.match.params.id, 10) : null
    const artifactId = props.match.params.artifactId ? parseInt(props.match.params.artifactId, 10) : null

    this.state = {
      responses: null,
      formErrors: false,
      submitType: null,
      redirect: null,
      messages: [],
      artifactId: artifactId,
      portfolioId: portfolioId,
      skippedReponses: [
        'uploads',
      ]
    }
  }

  componentDidMount(props) {
    this.props.fetchArtifact(this.state.artifactId)
    window.scrollTo(0, 0)

    if (this.props.artifacts && this.props.artifacts.newArtifactId) {
      this.props.removeArtifact({ id: 'newArtifactId' })
    }
  }

  render() {
    if (this.state.redirect) {
      setTimeout(() => {
        this.props.history.push(this.state.redirect)
      }, 2000)
    }

    if (!this.props.artifacts) {
      return this.renderLoadingScreen()
    }

    if (!this.props.artifacts[this.state.artifactId]) {
      return this.renderLoadingScreen()
    }

    if (!this.state.responses) {
      this.setResponses()
      return this.renderLoadingScreen()
    }

    return (
      <div className="eq-page">
        <div role="main" id="main-content" className="edit-artifact">
          {this.renderDeleteAction()}
          <form onSubmit={this.submit}>
            <H1 className="eq-title-block">Edit Artifact</H1>
            {this.renderMessages()}
            {this.renderArtifactHeader()}
            {this.renderUploads()}
            {this.renderArtifactUnit()}
            {this.renderResponses()}
            {this.renderSaveArtifactAction()}
          </form>
        </div>
      </div>
    )
  }

  getArtifact() {
    return this.props.artifacts[this.state.artifactId]
  }

  renderLoadingScreen() {
    return <div>...</div>
  }

  renderArtifactHeader() {
    return <div className="edit-artifact-header">
      {this.renderResponse(this.getResponse('artifactName'))}
      {this.renderDateInfo()}
    </div>
  }

  renderArtifactUnit() {
    return <div className="edit-artifact-unit">
      {this.renderResponse(this.getResponse('unitTiming'))}
      {this.renderResponse(this.getResponse('unitDay'))}
    </div>
  }

  /**
   * Render messages from the formstate.
   *
   * @returns
   */
  renderMessages() {
    if (this.state.messages.length < 1) {
      return null
    }

    let idx = 0;
    return <div className="form-messages">
      {this.state.messages.map(message => (
        <div
          key={'edit-artifact-message--' + idx++}
          className={"form-" + message.type}>
          {message.text}
        </div>
      ))}
    </div>
  }

  renderUploads() {
    let url = config.api.baseUrl + '/portfolios/'
    url += this.getArtifact().portfolio.id + '/artifacts/'
    url += this.getArtifact().id + '/'

    return (
      <Uploads
        artifact={this.getArtifact()}
        url={url}
        jwt={this.props.session.jwt}
      />
    )
  }

  /**
   * Render the artifact delete button.
   *
   * @returns
   */
  renderDeleteAction() {
    return <ModalPopover
    popoverClassName="delete-modal-popover-wrapper"
    portalClassName="delete-modal-popover-container"
    title="Delete Artifact"
    content={this.renderDeleteArtifactConfirmation()}
  >
    <Button
      className="bp3-button bp3-minimal eq-button eq-button-borderless eq-button-icon-left decline"
    >
      Delete Artifact
    </Button>
  </ModalPopover>
  }

  /**
   * Render save button for artifacts in parking lot.
   * @returns
   */
  renderParkingLotActions() {
    if (!this.getArtifact().parkingLot) {
      return null
    }

    return <React.Fragment>
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-inverted"
        type="submit"
        onClick={() => {
          this.setState({submitType: this.SAVE_TO_PARKING_LOT})
        }}
      >
        Save to Parking Lot
      </Button>
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-inverted"
        type="submit"
        onClick={() => {
          this.setState({submitType: this.SUBMIT_TO_PORTFOLIO})
        }}
      >
        Submit to Portfolio
      </Button>
    </React.Fragment>
  }

  /**
   * Render save button for artifacts not in parking lot
   * @returns
   */
  renderCompletedArtifactActions() {
    if (this.getArtifact().parkingLot) {
      return null
    }

    return <React.Fragment>
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-inverted"
        type="submit"
        onClick={() => {
          this.setState({submitType: this.SAVE_COMPLETED_ARTIFACT})
        }}
      >
        Save
      </Button>
    </React.Fragment>
  }

  /**
   * Render the save/submit buttons based on the current parking lot status.
   *
   * @returns
   */
  renderSaveArtifactAction() {
    return <div className="edit-artifact-actions">
      <Button
        className="bp3-button bp3-minimal eq-button link-button"
        onClick={this.props.history.goBack}
      >
        Cancel
      </Button>
      {this.renderParkingLotActions()}
      {this.renderCompletedArtifactActions()}
    </div>
  }

  /**
   * Render read only date info.
   *
   * @returns
   */
  renderDateInfo() {
    return <dl>
      <div>
        <dt>Date</dt>
        <dd>{dateFormat(this.getArtifact().created_at, 'mm/dd/yy')}</dd>
      </div>
      <div>
        <dt>Last Edited</dt>
        <dd>
          {dateFormat(this.getArtifact().updated_at, 'mmmm d, yyyy h:MMtt')}
        </dd>
      </div>
    </dl>
  }

  /**
   * Render each response as an editable field.
   *
   * @param {*} response
   * @returns
   */
  renderResponse(response) {
    return <ArtifactField
      response = {response}
      artifact = {this.getArtifact()}
      changeSingleValue = {this.changeSingleValue}
      changeCheckBoxValue =  {this.changeCheckBoxValue}
      changeNumberValue = {this.changeNumberValue}
      key = {"artifact-field--" + response.key}
    />
  }

  /**
   * Responses are rendered based on their type in the structure.
   *
   * @returns
   */
    renderResponses() {
    // Grab a shallow copy of the processed responses for the skip routine.
    let responses = {...this.getResponses()}
    let skip = [
      'artifactName',
      'unitTiming',
      'unitDay',
      'fileUpload',
      'uploads'
    ]

    // Some responses are placed in the artifact header, so we can skip those.
    skip.map(key => {
      delete responses[key]
      return true
    })

    return Object.keys(responses).map(key => {
      return this.renderResponse(responses[key])
    })
  }

  /**
   * onclick event for single value fields
   *
   * @param {*} event
   */
  changeSingleValue = (event) => {
    let value = event.currentTarget.value
    let name = event.currentTarget.name
    let responses = this.state.responses
    responses[name].value = value
    this.setState({responses: responses})
  }

  /**
   * onclick event for checkboxes
   *
   * @param {*} event
   */
  changeCheckBoxValue = (event) => {
    let value = event.currentTarget.value
    let name = event.currentTarget.name
    let responses = this.state.responses
    let response = responses[name]

    // add to list
    if (event.target.checked) {
      if (!response.value) {
        response.value = []
        response.value.push(value)
      } else if (!response.value.includes(value)) {
        response.value.push(value)
      }
    }
    // remove from list
    else {
      let values = response.value.filter(function(val) {
        return val !== value
      })

      response.value = values
    }

    this.setState({responses: responses})
  }

  changeNumberValue = (valueAsNumber, valueAsString, element) => {
    let value = valueAsNumber
    let name = element.name
    let responses = this.state.responses

    responses[name].value = value
    this.setState({responses: responses})
  }

  fieldHasValue(value) {
    if (value === null || value === undefined || value === "") {
      return false
    }

    if (Array.isArray(value) && value.length < 1) {
      return false
    }

    return true
  }

  /**
   * The edit artifact form submission event.
   *
   * This handles three seperate states
   *  Save (completed Artifact): Core questions answered.
   *  Submit to portfolio: Core questions answered.
   *  Save to parking lot: Core questions answered.
   *
   * @param {*} event
   */
  submit = (event) => {
    event.preventDefault()
    this.resetMessages()
    let artifact = {...this.getArtifact()}
    // Create the response data from scratch to remove empty values.
    artifact.responses = {}
    let formErrors = false
    let messages = []

    // Update responses in the artifact if each response is valid.
    artifact.structure.map(field => {
      if (this.state.skippedReponses.includes(field.key)) {
        return false
      }

      let fieldState = this.state.responses[field.key]
      if (ArtifactField.validateField(fieldState)) {
        // Only add response data if field has a real value.
        if (this.fieldHasValue(fieldState.value)) {
          artifact.responses[field.key] = fieldState.value
        }
      } else {
        formErrors = true
        messages.unshift({
          type: 'error',
          text: this.state.responses[field.key].error
        })
      }
      return true
    })

    // Do not submit uploads from within the responses.
    delete artifact.images
    delete artifact.videos
    delete artifact.documents

    if (formErrors) {
      // Throw a page error, do not save the artifact.
      messages.unshift({
        type: 'error',
        text: "There were errors in your form, please review and resubmit"
      })

      this.setState(
        {formErrors: formErrors, messages: messages},
        (
          window.scrollTo(
          {
            top: 0,
            left: 0,
            behavior: "smooth"
          }
        ))
      )
    } else {
      // If submit to portfolio is clicked, remove parking lot status.
      if (this.state.submitType === this.SUBMIT_TO_PORTFOLIO) {
        artifact.parkingLot = false
      }

      // Attempt to save the artifact.
      this.props.editArtifact(artifact)
      this.setState(
        {
          messages: messages,
          redirect: '/my-portfolios/' + this.state.portfolioId + '/artifacts/' + this.state.artifactId,
        },
        (
          window.scrollTo(
          {
            top: 0,
            left: 0,
            behavior: "smooth"
          }
        ))
      )
    }
  }

  /**
   * Reset form errors and messages.
   */
  resetMessages() {
    this.setState((prevState) => {
      let responses

      if (prevState.responses) {
        responses = {...prevState.responses}
        Object.keys(responses).forEach((key) => {
          delete responses[key].error
        })
      }

      return {
        formErrors: false,
        messages: [],
        responses,
      }
    })
  }

  /**
   * Map the artifact responses to their artifact response structure, by type.
   *
   * This will help the render function iterate over the responses without
   * having to link each response to their type.
   *
   * @returns void
   */
   setResponses() {
    if (!this.getArtifact()) {
      this.setState({responses: []})
      return
    }

    let responses = this.getArtifact().responses
    let structure = this.getArtifact().structure
    let builder = {}

    if (!responses || !structure) {
      this.setState({responses: []})
      return
    }

    structure.map(fieldStructure => {
      // Remove items that should not be manipulated
      if (this.state.skippedReponses.includes(fieldStructure['key'])) {
        return false
      }

      let key = fieldStructure['key']
      builder[key] = {
        ...fieldStructure,
        value: null
      }

      if (key in responses) {
        builder[key]['value'] = responses[key]
      }
      return true
    })

    this.setState({
      responses: builder,
    })
  }

  /**
   * Grab the processed responsed that contain their structure data.
   *
   * @returns Array response data or an empty array.
   */
  getResponses() {
    if (this.state.responses) {
      return this.state.responses
    } else {
      return []
    }
  }

  /**
   * Gets either the Artifact Name or a default value.
   *
   * @returns String
   */
  getTitle() {
    let responses = this.getResponses()

    // Set a default artifact name.
    if (!responses.artifactName) {
      return Artifact.defaultName
    }

    return responses.artifactName.value
  }

  /**
   *  Get a specific response by type.
   *
   * @param {String} responseType
   * @returns Array of specific response data or null.
   */
  getResponse(responseType) {
    let responses = this.getResponses()

    if (!responses[responseType]) {
      return null
    }

    return responses[responseType]
  }

  renderDeleteArtifactConfirmation() {
    let artifactName = this.getTitle()
    let confirmMessage = "Do you want to delete " + artifactName + "?"

    return <div>
      <h2>{confirmMessage}</h2>
      <div className="actions">
        <Button
          className={"bp3-button bp3-button bp3-minimal eq-button " + POPOVER_DISMISS}
        >NO</Button>
        <Button
          className="bp3-button bp3-button bp3-minimal eq-button eq-button-inverted"
          onClick={() => {
            this.props.deleteArtifact(this.getArtifact())
            this.setState({
              redirect: '/my-portfolios/' + this.state.portfolioId
            })
          }}
        >YES</Button>
      </div>
    </div>
  }
}

const mapStateToProps = state => ({
  artifacts: state.artifacts,
  session: state.session,
})

const mapDispatchToProps = dispatch => ({
  deleteArtifact: (artifact) => dispatch(deleteArtifact(artifact)),
  editArtifact: (artifact) => dispatch(editArtifact(artifact)),
  fetchArtifact: (id) => dispatch(fetchArtifact(id)),
  removeArtifact: (artifact) => dispatch(removeArtifact(artifact)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditArtifact)
