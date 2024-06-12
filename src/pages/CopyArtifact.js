import { Button, H1, H2, Radio, RadioGroup, Spinner } from '@blueprintjs/core'
import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { copyArtifact } from 'store/shared-artifacts'
import { fetchSharedPortfolios } from 'store/shared-portfolios'
import 'styles/CopyArtifact.css'

class CopyArtifact extends React.Component {
  constructor(props) {
    super()
    const portfolioId = props.match.params.id ? parseInt(props.match.params.id, 10) : null
    const artifactId = props.match.params.artifactId ? parseInt(props.match.params.artifactId, 10) : null

    this.state = {
      portfolioId: portfolioId,
      artifactId: artifactId,
      formDisabled: false,
      shared: props.match.path.startsWith('/shared-portfolios/'),
    }
  }

  componentDidMount() {
    this.props.fetchSharedPortfolios()
  }

  render() {
    if (this.props.session.redirect && this.props.session.redirect !== 'ERROR') {
      return (
        <Redirect to={this.props.session.redirect} />
      )
    }

    if (!this.props.sharedPortfolios) {
      return null
    }

    return <React.Fragment>
      <div className="eq-page">
        <div role="main" id="main-content" className="copy-artifact">
          <form onSubmit={this.submit}>
            <H1 className="eq-title-block">Copy Artifact</H1>
            {this.renderPortfolioOptions()}
            {this.renderCopyArtifactAction()}
          </form>
        </div>
      </div>
    </React.Fragment>
  }

  renderPortfolioOptions() {
    if (this.state.formDisabled && this.props.session.redirect !== 'ERROR') {
      return <div className="eq-loading">
        <H2>Copying artifact to shared portfolio</H2>
        <Spinner></Spinner>
      </div>
    }

    let idx = 0
    return <RadioGroup
      label={(<h2>Copy snapshot of artifact to:</h2>)}
      name={"copy_portfolio"}
      onChange={(e) => {
        let sharedPortfolioId = parseInt(e.currentTarget.value, 10)
        if (!isNaN(sharedPortfolioId)) {
          this.setState({selectedValue: sharedPortfolioId})
        }
      }}
      selectedValue={this.state.selectedValue}
      className={"required"}
    >
      {
      this.props.sharedPortfolios.map(choice => {
        let description = null
        let descriptionElements = []

        if (choice.topic) {
          descriptionElements.push(<div
            key={'copy_portfolio--dd--' + idx++}>
            <dt>Portfolio Topic:</dt>
            <dd>{choice.topic}</dd>
          </div>)
        }

        if (choice.plcName) {
          descriptionElements.push(<div
            key={'copy_portfolio--dt--' + idx++}>
            <dt>PLC Name:</dt>
            <dd>{choice.plcName}</dd>
          </div>)
        }

        if (descriptionElements.length) {
          description = <dl>
            {descriptionElements}
          </dl>
        }

        return <Radio
          label={(
            <React.Fragment>
              <div className="radio-label">{choice.name}</div>
              {description}
            </React.Fragment>
            )}
          value={choice.id}
          required={true}
          key={'copy_portfolio--' + idx++}
        />
      })}
    </RadioGroup>
  }

  /**
   * Render the save/submit buttons based on the current parking lot status.
   *
   * @returns
   */
  renderCopyArtifactAction() {
    let cancel = null
    if (!this.state.formDisabled || this.props.session.redirect === 'ERROR') {
      cancel = (
        <Button
          className="bp3-button bp3-minimal eq-button link-button eq-button-gray"
          onClick={this.props.history.goBack}
        >
          CANCEL
        </Button>
      )
    }

    return <div className="edit-artifact-actions">
      {cancel}
      <Button
        className="bp3-button bp3-minimal eq-button eq-button-inverted"
        type="submit"
        disabled={this.state.formDisabled && this.props.session.redirect !== 'ERROR'}
        >
          COMPLETE COPY
      </Button>
    </div>
  }

  submit = (event) => {
    event.preventDefault()

    if (isNaN(parseInt(this.state.selectedValue, 10))) {
      return
    }

    if (isNaN(parseInt(this.state.artifactId, 10))) {
      return
    }

    // Make sure selectedValue exists in sharedPortfolios
    let isValid = false
    let sharedPortfolio = null
    sharedPortfolio = this.props.sharedPortfolios.find(portfolio => {
      return portfolio.id === this.state.selectedValue
    })
    isValid = sharedPortfolio.id === this.state.selectedValue

    // Attempt to copy the artifact.
    if (isValid) {
      this.setState({formDisabled: true},
        () => this.props.copyArtifact(
          this.state.selectedValue,
          this.state.artifactId,
          this.state.shared,
        )
      )
    }
  }
}

const mapStateToProps = state => ({
  session: state.session,
  sharedPortfolios: state.sharedPortfolios,
})

const mapDispatchToProps = dispatch => ({
  fetchSharedPortfolios: () => dispatch(fetchSharedPortfolios()),
  copyArtifact: (aId, sharedPortfolioId, shared) => dispatch(
    copyArtifact(aId, sharedPortfolioId, shared)
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(CopyArtifact)
