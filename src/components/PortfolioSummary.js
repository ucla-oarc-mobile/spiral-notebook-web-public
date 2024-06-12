import React from 'react'
import PropTypes from 'prop-types'
import { Card, H2 } from '@blueprintjs/core'

import 'styles/PortfolioSummary.css'

class PortfolioSummary extends React.Component {
  render() {
    let wrapClasses = "eq-portfolio-summary"

    if (this.props.width && this.props.width === 'full') {
      wrapClasses += " eq-width-full"
    }

    if (this.props.columns) {
      wrapClasses += " eq-columns-" + this.props.columns
    }

    let actions = null

    if (this.props.actions) {
      actions = (
        <span className="eq-ps-actions">
          {this.props.actions}
        </span>
      )
    }

    let heading = 'Summary'
    if (this.props.name) {
      heading += ': ' + this.props.name
    }

    return (
      <div className={wrapClasses} >
        <Card>
          <H2>{heading}</H2>
          <div className="eq-ps-items">
            <span className="eq-ps-desc">
              <dl>{
                Object.keys(this.props.dl).map(label => (
                  <span className="item" key={"ps-item--" + label}>
                    <dt>{label}</dt><dd>{this.props.dl[label]}</dd>
                  </span>
                ))
              }</dl>
            </span>
            {actions}
          </div>
        </Card>
      </div>
    )
  }
}

PortfolioSummary.propTypes = {
  name: PropTypes.string,
  dl: PropTypes.object.isRequired,
  actions: PropTypes.object,
}

export default PortfolioSummary
