import React from 'react'

class ImageView extends React.Component {
  render() {
    const { fileName } = this.props.match.params

    return (
      <img
        src={'/uploads/' + fileName.replace(/\.html$/, '')}
        alt=""
        style={{ width: '100%' }}
      />
    )
  }
}

export default ImageView
