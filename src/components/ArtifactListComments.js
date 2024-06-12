import React from 'react'
import PropTypes from 'prop-types'
import ArtifactTable from './ArtifactTable'
import SharedArtifact from './SharedArtifact'

class ArtifactListComments extends React.Component {

  render() {
    return (
      <ArtifactTable
        ArtifactType={SharedArtifact}
        artifacts={this.props.artifacts}
        defaultSorted={[{ id: 'date', desc: true }]}
        defaultSelected={this.props.defaultSelected}
        isMutable={this.props.isMutable}
        shared={this.props.shared}
        columns={[
          {
            Header: ArtifactTable.sortableHeader('Artifact Name'),
            headerClassName: 'name',
            accessor: 'responses.artifactName',
            sortable: true,
            resizable: false,
            className: 'artifact-name'
          }, {
            Header: ArtifactTable.sortableHeader('Author'),
            headerClassName: 'author-sortable',
            Cell: props => this.renderAuthor(props),
            sortable: true,
            accessor: 'ownerUsername',
            sortMethod: (a, b) => {
              return a.localeCompare(b)
            },
            resizable: false,
            className: 'author-name'
          }, {
            Header: ArtifactTable.sortableHeader('Date'),
            headerClassName: 'date',
            accessor: 'created_at',
            Cell: props => this.renderDate(props),
            resizable: false,
            width: 80,
            className: 'date'
          }, {
            Header: 'Number of Comments',
            headerClassName: 'comment-count',
            accessor: 'commentCount',
            Cell: props => this.renderCommentIcon(props),
            resizable: false,
            width: 50,
            className: 'comment-count-wrapper'
          }
        ]}
      />
    )
  }

  renderCommentIcon(props) {
    let commentCount = 0

    if (props.value) {
      commentCount = props.value
    }

    return (
      <React.Fragment>
        <span className="comment-count">{commentCount}</span>
      </React.Fragment>
    )
  }

  renderAuthor(props) {
    let artifactAuthor = null
    if (props.original?.ownerUsername) {
      artifactAuthor = props.original.ownerUsername
    }

    if (this.props.compare) {
      return <label htmlFor={"artifact-checkbox-"+props.index}>
        {artifactAuthor}
      </label>
    } else {
      return <React.Fragment>
        {artifactAuthor}
      </React.Fragment>
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

ArtifactListComments.propTypes = {
  artifacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultSelected: PropTypes.number,
  isMutable: PropTypes.bool,
  shared: PropTypes.bool,
}

ArtifactListComments.defaultProps = {
  isMutable: false,
  shared: false,
}

export default ArtifactListComments
