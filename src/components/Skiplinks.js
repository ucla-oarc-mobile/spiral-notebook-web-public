import React from 'react'
import PropTypes from 'prop-types'

class SkipLinks extends React.Component {
  render() {
    return (
      <div id="skip">
        {this.renderSkipLink(this.props.navId, 'Jump to Navigation')}
        {this.renderSkipLink(this.props.contentId, 'Skip to main content')}
      </div>
    )
  }

  renderSkipLink(id, text) {
    if (id) {
      return (
        <a
          className="skip-link"
          href={id}
        >
          {text}
        </a>
      )
    }
  }
}

SkipLinks.propTypes = {
  navId: PropTypes.string,
  contentId: PropTypes.string,
}

export default SkipLinks
