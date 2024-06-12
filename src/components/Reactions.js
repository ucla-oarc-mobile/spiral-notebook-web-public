import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {Button, Popover, Position} from '@blueprintjs/core'
import { addReaction, deleteReaction } from 'store/shared-artifacts'

class Reactions extends React.Component {
  render() {
    let reactions = this.getArtifactReactions()
    let availableReactions = this.getAvailableReactions(reactions)

    return <div className="eq-article-reactions">
      {this.renderArtifactReactions(reactions)}
      {this.renderAddReactions(availableReactions)}
    </div>
  }

  getArtifactReactions() {
    let reactions = {}

    this.props.sharedArtifacts[this.props.aId].reactions.forEach(reaction => {
      if (reactions[reaction.value]) {
        reactions[reaction.value].count = reactions[reaction.value].count + 1
      } else {
        reactions[reaction.value] = {
          count: 1,
          selected: false,
        }
     }

      if (reaction.owner === this.props.user.id) {
        reactions[reaction.value].selected = true
        reactions[reaction.value].id = reaction.id
      }
    })

    return reactions
  }

  getAvailableReactions(reactions) {
    let selected
    let availableReactions = []

    this.props.availableReactions.forEach(reaction => {
      selected = (reactions[reaction] && reactions[reaction].selected)
      availableReactions.push({
        value: reaction,
        selected: selected,
        id: (selected) ? reactions[reaction].id : null
      })
    });

    return availableReactions

    // return this.props.availableReactions.filter(x => {
    //   return !Object.keys(reactions).includes(x)
    // })
  }

  renderArtifactReactions(reactions) {
    if (this.props.allowNewReactions && (!reactions || Object.keys(reactions).length < 1)) {
      return <div className="eq-button add-reaction">
        Add Reaction &rarr;
      </div>
    }

    return Object.keys(reactions).map((reaction) => {
      let selected = (reactions[reaction].selected) ? 'selected' : ''
      let action = null
      if (this.props.allowNewReactions) {
        action = (e) => {
          if (!reactions[reaction].selected) {
            this.props.addReaction(this.props.aId, reaction)
          } else if (reactions[reaction].id) {
            this.props.deleteReaction(reactions[reaction].id)
          }
        }
      }

      return <Button
        title={Reactions.getTitle(reaction)}
        key={"artifact-reaction--" + reaction + "--" + selected}
        className={"reaction " + selected}
        disabled={!this.props.allowNewReactions}
        onClick={action}
      >
        <span className="icon" role="img"
          aria-label={Reactions.getTitle(reaction) + "."}
        >{reaction}</span>
        <span className="count"
          aria-label={'Reaction Count: ' + reactions[reaction].count}
        >{reactions[reaction].count}</span>
      </Button>
    })
  }

  renderAddReactions(availableReactions) {
    if (!this.props.allowNewReactions) {
      return null;
    }

    if (availableReactions.length < 1) {
      // User has selected all reactions, so no need to render the add reaction.
      return null
    }

    return <Popover
        popoverClassName="artifact-reactions-wrapper-popover"
        portalClassName="artifact-reactions-container-popover"
        autoFocus={true}
        content={
          <div className="artifact-reactions-content">
            <div className="artifact-reactions-heading">
              <h2>ADD REACTION</h2>
              <Button className="bp3-popover-dismiss eq-close"></Button>
            </div>
            <div className="reactions">
              {availableReactions.map((reaction) => {
                return <div
                  className={"reaction"}
                  key={"add-reaction--" + reaction.value}
                >
                  <Button
                    title={Reactions.getTitle(reaction.value)}
                    className="icon"
                    onClick={(e) => {
                      if (!reaction.selected) {
                        this.props.addReaction(this.props.aId, reaction.value)
                      } else if (reaction.id) {
                        this.props.deleteReaction(reaction.id)
                      }
                    }}
                  >
                    <span role="img"
                      aria-label={Reactions.getTitle(reaction.value) + "."}
                    >{reaction.value}</span></Button>
                </div>
              })}
            </div>
          </div>
        }
        position={Position.BOTTOM}
      >
      <Button title="Toggle available reactions" className="reaction add">
        add
      </Button>
    </Popover>
  }
}

Reactions.getTitle = (value) => {
  if (typeof value !== 'string') {
    return null
  }

  switch (value.codePointAt(0)) {
    case 128278:
      return "Let's talk about this"

    case 11088:
      return "Exemplar"

    case 127753:
      return "Bridges grade levels"

    case 10067:
      return "I have a question"

    default:
      return null
  }
}

Reactions.propTypes = {
  availableReactions: PropTypes.array.isRequired,
  aId: PropTypes.number.isRequired
}

const mapStateToProps = state => {
  return {
    sharedArtifacts: state.sharedArtifacts,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => ({
  addReaction: (aId, reaction) => dispatch(addReaction(aId, reaction)),
  deleteReaction: (reactionId) => dispatch(deleteReaction(reactionId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Reactions)
