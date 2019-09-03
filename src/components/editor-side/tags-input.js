const React = require('react')
const ReactTags = require('react-tag-autocomplete')

export default class TagsInput extends React.Component {
  convertForState(tags) {
    return tags.map((e, i) => {
      return e.name
    })
  }
  convertForComponent(tags){
    return tags.map((e, i) => {
      return {name: e}
    })
  }

  handleDelete(i) {
    const tags = this.props.tags.slice(0)
    tags.splice(i, 1);
    this.props.onAddOrDelete(tags);
  }

  handleAddition(tag) {
    console.log('doing handleAddition');
    const newTag = tag.name;
    const tags = [].concat(...this.props.tags, newTag);
    this.props.onAddOrDelete(tags);
  }

  handleValidate(tag) {
    console.log('doing handleValidate');
    return !(this.props.tags.includes(tag))
  }

  render () {
    return (
      <ReactTags
        classNames={{root: 'react-tags'}}
        tags={this.convertForComponent(this.props.tags)}
        suggestions={this.props.suggestions ? this.convertForComponent(this.props.suggestions) : [] }
        allowNew={true}
        handleDelete={this.handleDelete.bind(this)}
        handleAddition={this.handleAddition.bind(this)}
        handleValidate={this.handleValidate.bind(this)}
      />
    )
  }
}
