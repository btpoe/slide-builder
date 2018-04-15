import React, { Component } from 'react';
import { TextField, Checkbox } from 'material-ui';
import Range from './Range';

const getField = ({
  type, id, onChange, title, minimum, maximum, value,
}, disabled) => {
  const commonProps = {
    label: title, id, onChange, disabled, value,
  };

  if (type === 'textarea') {
    Object.assign(commonProps, {
      multiline: true,
      rows: '4',
    });
  }

  switch (type) {
    case 'range':
      return (
        <Range
          min={minimum}
          max={maximum}
          helperText="Some important text"
          {...commonProps}
        />
      );
    case 'string':
    case 'integer':
    case 'textarea':
      return (
        <TextField
          helperText="Some important text"
          {...commonProps}
        />
      );
    default:
      return <div data-id={id} />;
  }
};

export default class Input extends Component {
  state = {
    disabled: false,
  };

  toggleEnable = () => {
    this.setState({ disabled: !this.state.disabled });
  };

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <Checkbox
          checked={!this.state.disabled}
          onChange={this.toggleEnable}
        />
        {getField(this.props, this.state.disabled)}
      </div>
    );
  }
}
