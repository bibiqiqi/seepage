import React from 'react';

export default class LabeledInput extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.meta.active && this.props.meta.active) {
        this.input.focus();
    }
  }
  render() {

    let error;
    if (this.props.meta.touched && this.props.meta.error) {
       error = <div className="form-error">{this.props.meta.error}</div>;
    }

    let warning;
    if (this.props.meta.touched && this.props.meta.warning) {
        warning = (
            <div className="form-warning">{this.props.meta.warning}</div>
        );
    }

    if (this.props.type === "checkbox") {
      return (
        <label className={this.props.className}>
          <input
            type="checkbox"
            {...this.props.input}
          />
          {this.props.label}</label>
      )
    } else {
        return (
          <label className={this.props.className}>
            {this.props.label}
            {error}
            {warning}
            <input
              {...this.props.input}
              type={this.props.type}
              placeholder={this.props.placeholder}
              ref={input => (this.input = input)}
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
