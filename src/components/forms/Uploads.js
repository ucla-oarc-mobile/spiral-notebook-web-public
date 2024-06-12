import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { H2, Button, FileInput, Spinner } from '@blueprintjs/core'
import { useUpload } from '@zach.codes/use-upload/lib/react'

import config from 'config'
import documentThumbnail from 'images/document.svg'

class Uploads extends React.Component {
  constructor() {
    super()

    // Newly-uploaded files have to be kept in their own state
    // It's hackish, but needed since we're trying to blend Redux with
    // the upload component (which uses React hooks)
    this.state = {
      imagesNew: [],
      videosNew: [],
      documentsNew: [],
      imagesDeleted: [],
      videosDeleted: [],
      documentsDeleted: [],
    }
  }

  render() {
    let files = this.props.artifact.images.concat(
      this.props.artifact.videos,
      this.props.artifact.documents,
      this.state.imagesNew,
      this.state.videosNew,
      this.state.documentsNew,
    ).filter(file => (
      !this.state.imagesDeleted.includes(file.id) &&
      !this.state.videosDeleted.includes(file.id) &&
      !this.state.documentsDeleted.includes(file.id)
    ))

    files.sort((a, b) => a.id < b.id ? -1 : 1)

    const uploads = files.map((file) => {
      if (file.mime.startsWith('image')) {
        return this.renderImage(file)
      }
      else if (file.mime.startsWith('video')) {
        return this.renderVideo(file)
      }
      else {
        return this.renderDocument(file)
      }
    })

    return (
      <div className="artifact-uploads">
        <H2>Uploads</H2>

        <div className="artifact-images">
          {uploads}

          <UploadArea
            url={this.props.url}
            jwt={this.props.jwt}
            onUpload={this.onUpload}
          />
        </div>
      </div>
    )
  }

  renderImage(image) {
    let thumbnail = image.url
    if (image.formats && image.formats.thumbnail) {
      thumbnail = image.formats.thumbnail.url
    }

    return (
      <div className="img-wrap" key={image.id}>
        <Button
          aria-label="Remove Image"
          className="eq-remove-media"
          onClick={() => this.confirmDelete('images', image.id)}
        />

        <img src={config.api.baseUrl + thumbnail} alt={image.alternativeText} />

        <div style={{
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
  }

  renderVideo(video) {
    let poster
    if (video.formats && video.formats.thumbnail) {
      poster = config.api.baseUrl + video.formats.thumbnail.url
    }

    return (
      <div className="video-wrap" key={video.id}>
        <Button
          aria-label="Remove Video"
          className="eq-remove-media"
          onClick={() => this.confirmDelete('videos', video.id)}
        />

        <video poster={poster} alt={video.alternativeText} controls>
          <source src={config.api.baseUrl + video.url} />
          <track label="English" kind="subtitles" srcLang="en" src={video.caption} default />
          Your browser does not support the video tag.
        </video>
        <div style={{
          height: '20px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <strong>
            {video.caption}.
          </strong>
          &nbsp;
          {video.name}
        </div>
      </div>
    )
  }

  renderDocument(doc) {
    return (
      <div className="document-wrap" key={doc.id}>
        <Button
          aria-label="Remove Document"
          className="eq-remove-media"
          onClick={() => this.confirmDelete('documents', doc.id)}
        />

        <a href={config.api.baseUrl + doc.url} download>
          <span className="eq-doc-label">
            {doc.name}
          </span>
          <img src={documentThumbnail} alt={doc.alternativeText} />
        </a>
        <div style={{
          height: '20px',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <strong>
            {doc.caption}.
          </strong>
          &nbsp;
          {doc.name}
        </div>
      </div>
    )
  }

  confirmDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      this.deleteFile(type, id)
    }
  }

  deleteFile = async (type, id) => {
    const response = await fetch(this.props.url + type + '/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.jwt,
      },
    })

    if (!response.ok) {
      window.alert(await response.text())
      return
    }

    this.setState((prevState) => {
      let newState = {}
      newState[type + 'Deleted'] = prevState[type + 'Deleted'].concat(id)

      return newState
    })
  }

  onUpload = (type, data) => {
    this.setState((prevState) => {
      let newState = {}
      newState[type + 'New'] = prevState[type + 'New'].concat(data)

      return newState
    })
  }
}

const UploadArea = (props) => {
  const { url, jwt, onUpload } = props

  let [upload, { progress, done, loading, xhr, data }] = useUpload(({ files }) => {
    let formData = new FormData()
    let fileType = 'documents'
    formData.append('file', files[0])

    // Pick the appropriate endpoint for the file type (default to "documents")
    if (files[0].type.startsWith('image/')) {
      fileType = 'images'
    }
    else if (files[0].type.startsWith('video/')) {
      fileType = 'videos'
    }

    return {
      url: url + fileType,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
      body: formData,
    }
  })

  useEffect(() => {
    if (done) {
      if (xhr.status === 200) {
        // Reverse-engineer the file type again since it's not saved
        const type = xhr.responseURL.replace(/.*\//, '')
        onUpload(type, data)
      }

      else {
        window.alert(data)
      }
    }
  }, [done, data, xhr, onUpload])

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <Spinner intent="primary" value={(progress || 0) / 100} />
      </div>
    )
  }

  return (
    <FileInput
      name="upload"
      className="eq-file-upload"
      text="Choose file..."
      onChange={(event) => {
        if (event.target.files) {
          upload({ files: event.target.files })
        }
      }}
    />
  )
}

Uploads.propTypes = {
  artifact: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  jwt: PropTypes.string.isRequired,
}

export default Uploads
