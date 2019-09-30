const React = require('react')
const ReactTags = require('react-tag-autocomplete')

export default class TagsInput extends React.Component {

  convertForComponent(tags){
    //console.log('doing convertForComponent with these tags', tags)
    return tags.map((e, i) => {
      return {name: e}
    })
  }

  handleDelete(i) {
    const tags = this.props.tags.slice(0)
    tags.splice(i, 1);
    console.log('doing handleDelete with this tag', tags);
    this.props.onAddOrDelete(tags);
  }

  handleAddition(tag) {
    //console.log('doing handleAddition with this tag', tag);
    const newTag = tag.name;
    const tags = [].concat(...this.props.tags, newTag);
    this.props.onAddOrDelete(tags);
  }

//eliminates duplicate tags on the entry
  handleValidate(tag) {
    //console.log('doing handleValidate with this tag', tag);
    //console.log('returning', !(this.props.tags.includes(tag)));
    return !(this.props.tags.includes(tag))
  }

  render () {
    return (
      <ReactTags
        placeholder={this.props.placeholder}
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
