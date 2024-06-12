import React from 'react'

class VideoView extends React.Component {
  render() {
    const { fileName } = this.props.match.params

    return (
      <video controls style={{ width: '100%' }}>
        <source src={'/uploads/' + fileName.replace(/\.html$/, '')} />
        Your browser does not support the video tag.
      </video>
    )
  }
}

export default VideoView
