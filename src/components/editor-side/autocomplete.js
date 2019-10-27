import React, { Fragment } from "react";
import PropTypes from "prop-types";

export default class Autocomplete extends React.Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  constructor(props) {
    super(props);

    this.state = {
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
    };
  }

//if the component has the hidden className in it,
//trigger a state change of clearing out the
//filtered suggestions and changing showSuggestions to false
  static getDerivedStateFromProps(nextProps, prevState) {
    //console.log('nextProps.className are', nextProps);
    if (nextProps.className.indexOf('hidden') > -1) {
      return ({
        filteredSuggestions: [],
        showSuggestions: false,
      });
    } else {
      return null;
    }
  }

  // Event fired when the input value is changed
  onChange = e => {
    //debugger;
    //first send the value to the callback of parent component (edit-form) to update parent state
    this.props.onChange(e);
    //then perform the comparison between suggestions from db and the user input internally
    const { suggestions } = this.props;
    const userInput = e.target.value;
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      filteredSuggestions,
      showSuggestions: true,
    });
  };

  render() {
    const {
      onChange,
      state: {
        filteredSuggestions,
        showSuggestions,
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (

          <ul className= "suggestions">
            {filteredSuggestions.map((suggestion, index) => {
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
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    return (
      <Fragment >
        <input
          className={this.props.className}
          name={this.props.name}
          type="text"
          onChange={onChange}
          value={this.props.value}
          autocomplete="off"
        />
        {suggestionsListComponent}
      </Fragment>
    );
  }
}
