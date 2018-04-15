import React from 'react';
import { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

export default ({ label, helperText, ...props }) => (
  <FormControl aria-describedby={`${props.id}-helper-text`}>
    <InputLabel htmlFor={props.id}>{label}</InputLabel>
    <div style={{ display: 'flex' }}>
      <input type="range" style={{ marginTop: '22px', flexGrow: 1 }} {...props} /> <span>{props.value}</span>
    </div>
    <FormHelperText id={`${props.id}-helper-text`}>{helperText}</FormHelperText>
  </FormControl>
);
