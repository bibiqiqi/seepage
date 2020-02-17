import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {connect} from 'react-redux';

class Autocomplete extends React.Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      showFilteredSuggestions: false,
      filteredSuggestions: [],
    };
    this.renderSuggestionsComponent = this.renderSuggestionsComponent.bind(this);
    this.handleChange = this.handleChange.bind(this)
  }

// if the component has the hidden className in it,
// trigger a state change of clearing out the
// filtered suggestions and changing showSuggestions to false
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.className.indexOf('hidden') > -1) {
      return ({
        filteredSuggestions: []
      });
    } else {
      return null;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.name !== this.props.name) {
      //console.log('this.props.name changed and its', this.props.name);
      this.setState({
        name: this.props.name,
        filteredSuggestions: [],
        showFilteredSuggestions: false,
      })
    }
  }

  // Event fired when the input value is changed
  handleChange(e) {
    //first send the value to the callback of parent component (edit-form) to update parent state
    this.props.onChange(e);
    //then perform the comparison between suggestions from db and the user input internally
    const suggestions = this.state.name? this.props[this.state.name] : undefined;
    const userInput = e.target.value;
    let filteredSuggestions;
    if ((!userInput) || (!suggestions)) {
      //if the field is empty, empty out the filteredSuggestions state
      filteredSuggestions = [];
    } else {
      //otherwise, iterate through the string to compare to the suggestions in the state
      filteredSuggestions = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
      );
      if(filteredSuggestions[0] === userInput) {
        this.setState({showFilteredSuggestions: false})
      } else {
        this.setState({showFilteredSuggestions: true})
      }
    }
    this.setState({filteredSuggestions});
  };

  renderSuggestionsComponent() {
    if ((this.state.filteredSuggestions.length) && (this.state.showFilteredSuggestions)) {
      return (
        <ul className= "suggestions">
          {this.state.filteredSuggestions.map((suggestion, index) => {
            let className;

            return (
              <li
                className={className}
                key={suggestion}
              >
                {suggestion}
              </li>
            );
          })}
        </ul>
      )
    } else return null;
  }

  render() {
    return (
      <Fragment >
        <input
          placeholder={this.props.placeholder}
          className={this.props.className}
          name={this.state.name}
          type="text"
          onChange={this.handleChange}
          value={this.props.value}
          autoComplete="off"
        />
        {this.renderSuggestionsComponent()}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  artistName: state.editorContent.suggestedArtists,
  title: state.editorContent.suggestedTitles,
  tag: state.editorContent.suggestedTags,
})

export default connect(mapStateToProps)(Autocomplete);
