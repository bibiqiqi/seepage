const React = require('react')
const ReactTags = require('react-tag-autocomplete')

export default class TagsInput extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [
        { id: 1, name: "postmodernism" },
        { id: 2, name: "technology" }
      ]
    }
  }
  handleDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }
  render () {
    return (
      <ReactTags
        classNames={{root: 'react-tags', root: this.props.className}}
        tags={this.state.tags}
        allowNew={true}
        handleDelete={this.handleDelete.bind(this)}
        handleAddition={this.handleAddition.bind(this)}
      />
    )
  }
}
