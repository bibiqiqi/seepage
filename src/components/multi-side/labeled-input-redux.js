import React, {Fragment} from 'react';

export default class LabeledInput extends React.Component {

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
        {error}
        {warning}
          <input
            type="checkbox"
            {...this.props.input}
          />
          {this.props.label}</label>
      )
    } else {
        return (
          <Fragment>
            {error}
            {warning}
            <input
              {...this.props.input}
              type={this.props.type}
              placeholder={this.props.placeholder}
              ref={input => {
                this.input = input}
              }
            />
            <label className={this.props.className}>
              {this.props.label}
            </label>
          </Fragment>
        )
    }
  }
}

LabeledInput.defaultProps = {
  required: false,
  placeholder: undefined,
  className: undefined
}
