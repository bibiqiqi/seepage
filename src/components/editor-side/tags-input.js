import React from 'react';
import {connect} from 'react-redux';
import ReactTags from 'react-tag-autocomplete';
import './tags-input.css';

class TagsInput extends React.Component {
  convertForComponent(tags){
    //converts the tags, passed from the parent, from an array of strings
    // to an array of objects with key of "name" to fit the need of react-tag-autocomplete
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
    const newTag = tag.name.toLowerCase().trim();
    const tags = [].concat(...this.props.tags, newTag);
    this.props.onAddOrDelete(tags);
  }

  handleValidate(tag) {
    //eliminates duplicate tags on the entry
    return !(this.props.tags.includes(tag))
  }

  render () {
    return (
      <ReactTags
        placeholder='Tags'
        classNames={{root: 'react-tags'}}
        tags={this.convertForComponent(this.props.tags)}
        suggestions={this.props.suggestedTags ? this.convertForComponent(this.props.suggestedTags) : [] }
        allowNew={true}
        handleDelete={this.handleDelete.bind(this)}
        handleAddition={this.handleAddition.bind(this)}
        handleValidate={this.handleValidate.bind(this)}
      />
    )
  }
}

const mapStateToProps = state => ({
  suggestedTags: state.editorContent.suggestedTags
});

export default connect(mapStateToProps)(TagsInput);
