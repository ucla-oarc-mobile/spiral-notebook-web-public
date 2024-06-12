import React from 'react'
import PropTypes from 'prop-types'
import { Button, H2, H3, Icon } from '@blueprintjs/core'
import dateFormat from 'dateformat'
import AwesomeSlider from 'react-awesome-slider'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import config from 'config'
import ModalPopover from './ModalPopover'

import documentThumbnail from 'images/document.svg'
import 'react-awesome-slider/dist/styles.css'
import 'styles/Artifact.css'

class ArtifactView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      caruselRotation: []
    }
  }

  render() {
    this.setResponses()
    return (
      <div className="artifact-view">
        <div className="artifact-header">
          <div className="artifact-header-left">
            <H2>{this.getTitle()}</H2>
            {this.renderHeaderInfo()}
          </div>
          {this.props.headerRight}
        </div>
        {this.renderMedia()}
        {this.renderResponses()}
        {this.props.footer}
      </div>
    )
  }

  getArtifact() {
    return this.props.artifact
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
    let responses = this.getArtifact().responses
    let structure = this.getArtifact().structure
    let builder = {}

    if (!responses || !structure) {
      this.responses = []
      return
    }

    // The sort order of the builder is based on the order in responses.
    structure.map(responseStructure => {
      let key = responseStructure.key

      if (responseStructure) {
        builder[key] = {
          ...responseStructure,
          value: responses[key]
        }

        return true
      }

      return false
    })

    this.responses = builder
  }

  /**
   * Grab the processed responsed that contain their structure data.
   *
   * @returns Array response data or an empty array.
   */
  getResponses() {
    if (this.responses) {
      return this.responses
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
      return ArtifactView.defaultName
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

  renderHeaderInfo() {
    let unitTiming = this.getResponse('unitTiming')
    let unitDay = this.getResponse('unitDay')

    let builder = []
    const artifact = this.getArtifact()

    if (this.props.shared) {
      const grades = artifact.portfolioGrades

      builder.push(
        <React.Fragment>
          <dt>Grade Levels</dt>
          <dd>
            {Array.isArray(grades) ? grades.join(', ') : ''}
          </dd>
        </React.Fragment>
      )
    }

    if (unitTiming) {
      builder.push(
        <React.Fragment key="unit-timing">
          <dt>Unit Timing</dt>
          <dd>{unitTiming.value}</dd>
        </React.Fragment>
      )
    }

    if (unitDay) {
      builder.push(
        <React.Fragment key="unit-day">
          <dt>Unit Day</dt>
          <dd>{unitDay.value}</dd>
        </React.Fragment>
      )
    }

    return <dl>
      <dt>Last Edited</dt>
      <dd>{dateFormat(artifact.updated_at, 'mmmm d, yyyy h:MMtt')}</dd>
      <dt>Date Created</dt>
      <dd>{dateFormat(artifact.created_at, 'mm/dd/yy')}</dd>
      {builder}
    </dl>
  }

  /**
   * Render the image popover with an image slider.
   *
   * @param {Array} rawImages Array of artifact image with not html.
   * @param {Number} idx The selected idx for the slider to default.
   * @param {HTML} imageHtml Renderable image to use as the popover listener.
   * @returns Renderable image that will display the popover when clicked.
   */
  renderPopover(idx, imageHtml) {
    let rawImages = this.getArtifact()['images']
    if (!rawImages || !rawImages.length) {
      return null
    }

    let imgIdx = 0
    let images = rawImages.map(image => (
      this.renderImage(image, imgIdx++, false)
    ))

    return <ModalPopover
      popoverClassName="artifact-image-wrapper-popover"
      portalClassName="artifact-image-container-popover"
      content={this.renderCaruselMedia(images, "artifact-popover", idx, false)}
    >
      <div className="img-wrap">{imageHtml}</div>
    </ModalPopover>
  }

  renderImageControls(idx, zoomIn, zoomOut, zoomToElement) {
    return <div className="eq-carusel-controls">
      <Button
        className="eq-button eq-button-plain eq-button-control left"
        data-media-index={idx}
        aria-label="Rotate image left."
        onClick={(e) => {
          let mediaIndex = e.currentTarget.dataset.mediaIndex
          let caruselRotation = this.state.caruselRotation

          if (mediaIndex in caruselRotation && caruselRotation[idx] !== 0) {
            caruselRotation[idx] = (caruselRotation[idx] - 1) % 4
          } else {
            caruselRotation[idx] = 3
          }

          this.setState({caruselRotation: caruselRotation})
        }}
      >
        <Icon icon="image-rotate-left" title="Rotate image left." iconSize={25}/>
      </Button>
      <Button
        className="eq-button eq-button-plain eq-button-control"
        aria-label="Zoom in on image."
        onClick={() => zoomIn()}
      >
        <Icon icon="zoom-in" title="Zoom in on image." iconSize={25}>Zoom In</Icon>
      </Button>
      <Button
        className="eq-button eq-button-plain eq-button-control"
        aria-label="Center and fit image."
        onClick={() => zoomToElement("element--" + idx)}
      ><Icon icon="reset" title="Center and fit image." iconSize={20}>Zoom In</Icon></Button>
      <Button
        className="eq-button eq-button-plain eq-button-control"
        aria-label="Zoom out on image."
        onClick={() => zoomOut()}
      ><Icon icon="zoom-out" title="Zoom out on image." iconSize={25}>Zoom In</Icon></Button>
      <Button
        className="eq-button eq-button-plain eq-button-control right"
        data-media-index={idx}
        aria-label="Rotate image right."
        onClick={(e) => {
          let mediaIndex = e.currentTarget.dataset.mediaIndex
          let caruselRotation = this.state.caruselRotation

          if (mediaIndex in caruselRotation) {
            caruselRotation[idx] = (caruselRotation[idx] + 1) % 4
          } else {
            caruselRotation[idx] = 1
          }

          this.setState({caruselRotation: caruselRotation})
        }}
      >
        <Icon icon="image-rotate-right" title="Rotate image right." iconSize={25}/>
      </Button>
    </div>
  }

  /**
   * Render an image based on whether or not it will be in a popover.
   *
   * @param {Array} rawImages Array of artifact image with not html.
   * @param {HTML} image Specific image to create html for.
   * @param {Number} selected The selected idx for the slider to default.
   * @param {Boolean} hasPopover, Should the images have a popover?
   * @returns Renderable image.
   * @returns
   */
  renderImage(image, idx, hasPopover) {
    let rotation = ''
    if (idx in this.state.caruselRotation) {
      rotation = "carusel-image-rotation-" + this.state.caruselRotation[idx]
    }

    let imageHtml = <img
      alt={image['alternativeText']}
      src={config.api.baseUrl + image['url']}
    />

    if (hasPopover) {
      return (
        <div>
          {this.renderPopover(idx,imageHtml)}
          <div style={{
            maxWidth: '220px',
            height: '20px',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            <strong>
              {image.caption}.
            </strong>
            &nbsp;
            {image.name}
          </div>
        </div>
      )
    } else {
      return <div className="img-wrap">
          <TransformWrapper
            minScale={.25}
            limitToBounds={false}
            centerOnInit={true}
          >
            {({ zoomIn, zoomOut, resetTransform, zoomToElement, ...rest }) => (
              <React.Fragment>
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "calc(100vh - 117px)",
                    maxWidth: "100%",
                    maxHeight: "calc(100vh - 117px)",
                  }}
                  centerOnInit={true}
                >
                  <span
                    onLoad={() =>zoomToElement("element--" + idx, undefined, 0)}
                    id={"element--" + idx}
                    className={"carusel-image " + rotation}>
                    {imageHtml}
                  </span>
                </TransformComponent>
                {this.renderImageControls(idx, zoomIn, zoomOut, zoomToElement)}
              </React.Fragment>
            )}
          </TransformWrapper>
      </div>
    }
  }

  renderStaticImages() {
    let rawImages = this.getArtifact()['images']
    if (!rawImages || !rawImages.length) {
      return []
    }

    let idx = 0
    let images = []
    rawImages.map(image => (
      images.push(this.renderImage(image, idx++, true))
    ))

    return images
  }

  /**
   * Create the media slider for the compare view and the popover view.
   *
   * @param {Array} media Array of renderable objects.
   * @param {String} wrapper Carusel wrapper class
   * @param {Number} selected The selected idx for the slider to default.
   * @returns Renderable image slider.
   */
  renderCaruselMedia(media, wrapper, selected) {
    if (!media || !media.length) {
      return null
    }

    return <AwesomeSlider
      className={wrapper + " artifact-slider"}
      bullets={false}
      selected={selected}
      organicArrows={false}
      buttonContentRight={<div className="eq-right-arrow"></div>}
      buttonContentLeft={<div className="eq-left-arrow"></div>}
      infinite={false}
    >
      {media}
    </AwesomeSlider>
  }

  /**
   * Render the artifact images based on wheter the user is comparing.
   *
   * @returns
   */
  renderMedia() {

    let media = [
      ...this.renderStaticImages(),
      ...this.renderVideos(),
      ...this.renderDocuments()
    ]

    if (this.props.isCompared) {
      // Wrap the media in a carusel
      media = this.renderCaruselMedia(
        media,
        "artifact-images",
        0,
        false
      )
    }

    return <div className="artifact-images">
      {media}
    </div>
  }

  /**
   * Prepare the artifact documents for rendering
   *
   * @returns Array of renderable artifact document objects
   */
   renderDocuments() {
    if (!this.getArtifact()['documents'] || this.getArtifact()['documents'].length < 1) {
      return []
    }
    let rawDocuments = this.getArtifact()['documents']
    let idx = 0

    let documents = []
    rawDocuments.map(rawDocument => {
      documents.push(
        <div
          className="document-wrap"
          key={"artifact-documents--" + idx++}
        >
          <a
            href={config.api.baseUrl + rawDocument['url']}
            target="_blank"
            rel="noreferrer"
          >
            <span className="eq-doc-label">
              {rawDocument['name']}
            </span>
            <img
              alt={rawDocument['alternativeText']}
              src={documentThumbnail}
            />
          </a>
          <div style={{
            maxWidth: '220px',
            height: '20px',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            <strong>
              {rawDocument['caption']}.
            </strong>
            &nbsp;
            {rawDocument['name']}
          </div>
        </div>
      )
      return true
    })

    return documents
  }

  /**
   * Prepare the artifact videos for rendering
   *
   * @returns Array of renderable artifact video objects
   */
   renderVideos() {
    if (!this.getArtifact()['videos'] || this.getArtifact()['videos'].length < 1) {
      return []
    }

    let rawVideos = this.getArtifact()['videos']
    let idx = 0

    let videos = []

    rawVideos.map(rawVideo => {
      videos.push(
        <div
          className="artifact-videos"
          key={"artifact-videos--" + idx++}
        >
          <video
            controls
            poster={rawVideo.previewUrl}
            alt={rawVideo.alternativeText}
          >
              <source src={config.api.baseUrl + rawVideo.url} />
              <track label="English" kind="subtitles" srcLang="en" src={rawVideo.caption} default></track>
              Your browser does not support the video tag.
          </video>
          <div style={{
            maxWidth: '220px',
            height: '20px',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            <strong>
              {rawVideo.caption}.
            </strong>
            &nbsp;
            {rawVideo.name}
          </div>
        </div>
      )
      return true
    })
    return videos
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
      'unitDay'
    ]

    let regularResponses = []
    let bonusResponses = []

    // Some responses are placed in the artifact header, so we can skip those.
    skip.map(key => {
      delete responses[key]
      return true
    })

    Object.keys(responses).forEach(key => {
      let response = responses[key]
      let element = null

      switch (response.type) {
        case 'expansionPanelChoices':
        case 'multipleResponse':
          element = this.renderMultipleResponse(response)
          break

        default:
          // Make sure that all responses are renderable.
          element = (<p>{(response.value) ? response.value.toString() : ''}</p>)
          break
      }

      let renderedReponse = <React.Fragment key={key}>
        <div className="artifact-response">
          <H3>{response.text}</H3>
          {element}
        </div>
        <hr />
      </React.Fragment>

      if (response.bonus) {
        bonusResponses.push(renderedReponse)
      } else {
        regularResponses.push(renderedReponse)
      }
    })

    // Set a header for the bonus questions.
    if (bonusResponses.length > 0) {
      bonusResponses = <React.Fragment>
        <H2>Team questions for shared portfolio</H2>
        {bonusResponses}
      </React.Fragment>
    }

    return <React.Fragment>
      {regularResponses}
      {bonusResponses}
    </React.Fragment>
  }

  renderMultipleResponse(response) {
    if (response.value === null || response.value === undefined) {
      return false
    }
    return <div className="artifact-multiple-response">
      {response.value.map((value) => {
        return <span
          className="eq-button eq-button-gray no-action"
          >
            {value}
        </span>
      })}
    </div>
  }
}


ArtifactView.defaultName = "(Unnamed)"

ArtifactView.propTypes = {
  headerRight: PropTypes.element,
  footer: PropTypes.element,
  isCompared: PropTypes.bool,
  shared: PropTypes.bool,
}

ArtifactView.defaultProps = {
  headerRight: null,
  footer: null,
  isCompared: false,
  shared: false,
}

export default ArtifactView
