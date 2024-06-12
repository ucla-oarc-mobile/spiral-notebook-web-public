import { Popover } from '@blueprintjs/core'
import PropTypes from 'prop-types'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'
import React from 'react'

import 'styles/ModalPopover.css'

class ModalPopover extends React.Component {
  render() {
    let title = null
    if (this.props.title) {
      title = <h1
        id="eq-modal-popover-title"
        className="eq-modal-popover-title">{this.props.title}</h1>
    }

    return <Popover
      minimal
      popoverClassName={"eq-modal-popover-wrapper " + this.props.popoverClassName}
      portalClassName={"eq-modal-popover-container " + this.props.portalClassName}
      canEscapeKeyClose={true}
      hasBackdrop={true}
      boundary=''
      fill={true}
      autoFocus={true}
      content={
        <div
          className="eq-modal-popover-content"
          aria-modal="true"
          role="dialog"
        >
          {title}
          <button
            aria-label="Close popover."
            className={POPOVER_DISMISS + " eq-close"}></button>
          {this.props.content}
        </div>
      }
      defaultIsOpen={!!this.props.defaultIsOpen}
      onOpened={this.props.onOpened}
      onClosed={this.props.onClosed}
    >
      {this.props.children}
    </Popover>
  }
}

ModalPopover.propTypes = {
  content: PropTypes.object.isRequired,
  title: PropTypes.string,
  popoverClassName: PropTypes.string,
  portalClassName: PropTypes.string,
  defaultIsOpen: PropTypes.bool,
  onOpened: PropTypes.func,
  onClosed: PropTypes.func,
}

ModalPopover.defaultProps = {
  popoverClassName: '',
  portalClassName: '',
}

export default ModalPopover
