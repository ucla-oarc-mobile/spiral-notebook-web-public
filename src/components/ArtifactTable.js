import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table-v6'
import { Checkbox, H2 } from '@blueprintjs/core'

import Artifact from './Artifact'

import sortIcon from 'images/sort.svg'
import 'react-table-v6/react-table.css'
import 'styles/ArtifactTable.css'

class ArtifactTable extends React.Component {
  static artifactsRE = /\/artifacts\/.*/

  constructor(props) {
    super(props)

    this.state = {
      compare: false,
      compareIdx: 0,
      maxCompare: 2,
      comparing: [],
      selected: props.defaultSelected,
      selectFirst: !props.defaultSelected,
    }
  }

  render() {
    if (this.props.artifacts) {
      return (
        <div className="artifact-info">
          <div className="artifact-table">
            <div className="artifact-table-heading">
              {this.renderMainCompareCheckbox()}
              <H2>Artifacts</H2>
            </div>
            <ReactTable
              className={"eq-react-table" + ((this.state.compare) ? ' comparing' : '')}
              columns={
                [{
                  Header: <div aria-label="Compare?"></div>,
                  headerClassName: 'compare',
                  accessor: 'compare',
                  Cell: props => this.renderRowCompareCheckbox(props),
                  resizable: false,
                  width: 44,
                  className: 'compare'
                }].concat(this.getColumns())}
              data={this.props.artifacts}
              minRows={0}
              noDataText="No artifacts found"
              showPagination={false}
              defaultSorted={this.props.defaultSorted}
              defaultSortDesc={true}
              defaultPageSize={this.props.artifacts.length}
              style={{
                height: "618px",
              }}
              getTrProps={(state, rowInfo) => {
                return {
                  ...this.rowOnClick(state, rowInfo),
                  className: (rowInfo.original.id === this.state.selected) ? 'selected': '',
                  tabIndex: 0,
                }
              }}
              onFetchData={(state, instance) => {
                const rows = state.sortedData
                if (!this.props.defaultSelected && rows.length) {
                  this.setSelected(rows[0]._original.id)
                  this.setState({
                    selectFirst: false
                  })
                }
              }}
            />
          </div>
          {this.renderArtifactView()}
        </div>
      )
    } else {
      return null
    }
  }

  /**
   * Grabs the column structure to use in react table v6.
   *
   * @returns Array of column information for react table v6.
   */
  getColumns() {

    // Grab a copy of the column reference, columns references objects.
    let columns = [
      ...this.props.columns
    ]

    let idx = columns.findIndex(
      obj => obj.headerClassName === 'name'
    )

    // Be careful not to override referenced Artifact Name.
    columns[idx] = {...columns[idx]}
    columns[idx]['Cell'] = props => this.renderArtifactName(props)

    return columns
  }

  /**
   * Determines whether or not the clicked checkbox is already checked.
   *
   * @param {number} id
   * @returns boolean
   */
  isChecked(id) {
    return this.state.comparing.includes(id)
  }

  /**
   * This selects and deselects the current row if clicked.
   *
   * @param {*} state
   * @param {*} rowInfo
   * @returns Assoc array with onClick function or empty.
   */
  rowOnClick(state, rowInfo) {
    // Disable selection if comparing.
    if (this.state.compare || !(rowInfo && rowInfo.row)) {
      return {}
    }

    return {
      onClick: () => {
        if (rowInfo.original.id === this.state.selected) {
          this.unsetSelected()
        } else {
          this.setSelected(rowInfo.original.id)
        }
      },
      onKeyPress: (e) => {
        switch (e.charCode) {
          case 13: // Enter
          case 32: // Space
            e.preventDefault()
            if (rowInfo.original.id === this.state.selected) {
              this.unsetSelected()
            } else {
              this.setSelected(rowInfo.original.id)
            }
            break;

          default:
            break;
        }
      }
    }
  }

  unsetSelected() {
    this.setState({
      selected: null
    }, () => {
      let path = window.location.pathname

      if (ArtifactTable.artifactsRE.test(path)) {
        path = path.replace(ArtifactTable.artifactsRE, '')
      }

      window.history.replaceState(this.state, '', path)
    })
  }

  setSelected(id) {
    this.setState({
      selected: id
    }, () => {
      let path = window.location.pathname

      if (ArtifactTable.artifactsRE.test(path)) {
        path = path.replace(ArtifactTable.artifactsRE, '')
      }

      window.history.replaceState(this.state, '', path + '/artifacts/' + id)
    })
  }

  /**
   * Set the comparing values to their default values.
   *
   * @returns boolean Whether the set function was successful.
   */
  resetComparing() {
    this.setState({
      comparing: [],
      compareIdx: 0,
    })

    return true
  }

  /**
   * Remove the given value from the comparing window.
   *
   * @param {number} value
   * @returns boolean Whether the set function was successful.
   */
  unsetComparing(value) {
    let comparing = this.state.comparing
    let idx = comparing.findIndex(
      indexValue => Number(indexValue) === Number(value)
    )

    if (idx < 0 || idx >= this.state.maxCompare) {
      return false
    }

    if (idx === 0) {
      this.unsetSelected()
    }

    comparing.splice(idx, 1)

    this.setState({
      comparing: comparing,
      compareIdx: this.state.comparing.length
    })

    return true
  }

  /**
   * Adds the given row to the compare window.
   *
   * @param {number} idx
   * @returns boolean Whether the set function was successful.
   */
  setComparing(id) {
    const artifact = this.props.artifacts.find(artifact => artifact.id === id)
    if (!artifact) {
      return false
    }

    let compareIdx = this.state.compareIdx
    let comparing = this.state.comparing

    // This should always be an integer.
    comparing[compareIdx] = Number(id)

    // Use the maxCompare value to set the compareIdx in a loop.
    if ((compareIdx + 1) < this.state.maxCompare) {
      compareIdx++
    }

    this.setState({
      comparing: comparing,
      compareIdx: compareIdx,
    })

    return true
  }

  renderMainCompareCheckbox(props) {
    return <Checkbox
      label="Compare"
      onChange={event => {
        this.resetComparing()
        this.unsetSelected()

        this.setState({
          compare: event.currentTarget.checked,
        })
      }}
    />
  }

  /**
   * Create the label for each rows compare checkbox. This helps accessibility.
   *
   * @param {*} props
   */
   renderArtifactName(props) {
    if (this.state.compare) {
      return <label htmlFor={"artifact-checkbox-"+props.index}>
        {props.value || Artifact.defaultName}
      </label>
    } else {
      return <React.Fragment>
        {props.value || Artifact.defaultName}
      </React.Fragment>
    }
  }

  renderRowCompareCheckbox(props, defaultValue) {
    if (this.state.compare) {
      return (
          <Checkbox
            id={"artifact-checkbox-" + props.original.id}
            onChange={event => {
              // If current row is checked, compare the artifact.
              if (event.currentTarget.checked) {
                this.setComparing(props.original.id)

              // If current row is unchecked, stop comparing the artifact.
              } else {
                this.unsetComparing(props.original.id)
              }
            }}
            // Set the default checked value based on the current compare state.
            checked={this.isChecked(props.original.id)}
          />
      )
    } else {
      return null
    }
  }

  renderArtifactView() {
    if (this.state.compare) {
      return this.renderArtifactCompare()
    } else if (this.state.selected !== null || this.state.selected !== undefined) {
      return this.renderArtifactSelected()
    }

    return null
  }

  renderArtifactCompare() {
    let artifacts = []
    for (let idx = 0; idx < this.state.maxCompare; idx++) {
      artifacts.push(this.renderArtifact(this.state.comparing[idx]))
    }

    return <div className="artifact-compare">
      {artifacts}
    </div>
  }

  renderArtifactSelected() {
    return <React.Fragment>
      {this.renderArtifact(this.state.selected)}
    </React.Fragment>
  }

  renderArtifact(id) {
    const artifact = this.props.artifacts.find(artifact => artifact.id === id)

    if (artifact) {
      return <this.props.ArtifactType
        key={id}
        aId={id}
        isMutable={this.props.isMutable}
        shared={this.props.shared}
        isCompared={this.state.comparing.length > 1}
      />
    }

    return null
  }
}

ArtifactTable.sortableHeader = (text) => {
  return (
    <span>
      {text}
      <span className="sort">
        <img
          alt=""
          src={sortIcon}
        />
      </span>
    </span>
  )
}

ArtifactTable.propTypes = {
  ArtifactType: PropTypes.elementType.isRequired,
  artifacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  isMutable: PropTypes.bool,
  shared: PropTypes.bool,
  defaultSelected: PropTypes.number,
}

ArtifactTable.defaultProps = {
  isMutable: false,
  shared: false,
}

export default ArtifactTable
