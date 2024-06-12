import React from 'react'
import PropTypes from 'prop-types'
import ArtifactTable from './ArtifactTable'
import pLotIcon from 'images/parkinglot@2x.png'
import Artifact from './Artifact'

class ArtifactListParkingLot extends React.Component {
  render() {
    if (this.props.artifacts) {
      return (
        <ArtifactTable
          ArtifactType={Artifact}
          artifacts={this.props.artifacts}
          defaultSorted={[{ id: 'parkingLot', desc: true }]}
          defaultSelected={this.props.defaultSelected}
          isMutable={true}
          columns={[
            {
              Header: ArtifactTable.sortableHeader('Artifact Name'),
              headerClassName: 'name',
              accessor: 'responses.artifactName',
              resizable: false,
              width: 186,
              className: 'artifact-name'
            }, {
              Header: ArtifactTable.sortableHeader('Parking Lot'),
              headerClassName: 'plot',
              accessor: 'parkingLot',
              Cell: props => this.renderParkingLotIcon(props),
              resizable: false,
              width: 129,
              className: 'parking-lot'
            }, {
              Header: ArtifactTable.sortableHeader('Date'),
              headerClassName: 'date',
              accessor: 'created_at',
              Cell: props => this.renderDate(props),
              resizable: false,
              width: 92,
              className: 'date'
            }
          ]}
        />
      )
    } else {
      return null
    }
  }

  renderParkingLotIcon(props) {
    if (!props.value) {
      return null
    }

    if (props.value) {
      return (
        <img
          className="parking-lot-icon"
          alt={props.row['name'] + 'is in the parking lot.'}
          src={pLotIcon}
        />
      )
    }
  }

  renderDate(props) {
    if (!props.value) {
      return null
    }

    if (props.value) {
      return (
        new Date(props.value).toLocaleDateString(
          'en-US', {year: '2-digit', month: '2-digit', day: '2-digit'}
        )
      )
    }
  }
}

ArtifactListParkingLot.propTypes = {
  artifacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultSelected: PropTypes.number,
}

export default ArtifactListParkingLot
