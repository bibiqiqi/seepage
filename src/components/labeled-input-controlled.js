import React from 'react';

export default class LabeledInput extends React.Component {
  render() {
    if (this.props.type === "checkbox") {
      return (
        <label className={this.props.className}>
          <input
            checked={this.props.checked}
            name={this.props.name}
            type="checkbox"
            onChange={(e) => this.props.onChange(e)}
          />
          {this.props.label}</label>
      )
    } else if (this.props.type === "file") {
        return (
          <label className={this.props.className}>
            {this.props.label}
            <input
              files={this.props.files}
              name={this.props.name}
              type="file"
              multiple={true}
              onChange={(e) => this.props.onChange(e)}
            />
          </label>
        )
      } else {
          return (
            <label className={this.props.className}>
              {this.props.label}
              <input
                placeholder={this.props.placeholder}
                value={this.props.value}
                name={this.props.name}
                type="text"
                onChange={(e) => this.props.onChange(e)}
                autocomplete="off"
              />
            </label>
         )
      }
    }
  }

LabeledInput.defaultProps = {
  required: false,
  placeholder: undefined,
  className: undefined
}
