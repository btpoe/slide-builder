import React, { Component } from 'react';
import { Typography } from 'material-ui';
import Input from './Input';

const elementReducer = ({
  schema = {},
  formData = '',
  onChange, key = 'root',
}) => {
  switch (schema.type) {
    case 'object':
      return [<Typography variant="title" key="__title" gutterBottom>{schema.title}</Typography>].concat((schema.propertyOrder || Object.keys(schema.properties)).map(prop => elementReducer({
        schema: schema.properties[prop],
        formData: formData[prop],
        onChange,
        key: `${key}-${prop}`,
      })));
    case 'array':
      return [];
    case 'color':
    case 'integer':
    case 'range':
    case 'string':
    case 'textarea':
      return <Input key={key} id={key} value={formData} onChange={onChange} {...schema} />;
    default:
      return <div />;
  }
};

const formDataReducer = ({
  formNode,
  schema = {},
  key = 'root',
}) => {
  switch (schema.type) {
    case 'object':
      return Object.keys(schema.properties).reduce((res, prop) => {
        res[prop] = formDataReducer({
          formNode,
          schema: schema.properties[prop],
          key: `${key}-${prop}`,
        });

        return res;
      }, {});
    case 'array':
      return [];
    case 'color':
    case 'integer':
    case 'range':
    case 'string':
    case 'textarea':
      return formNode.elements[key].value;
    default:
      return null;
  }
};

export default class extends Component {
  onChange = () => {
    const formData = formDataReducer({
      formNode: this.rootNode,
      schema: this.props.schema,
    });
    this.props.onChange({ formData });
  };

  render() {
    const { schema, formData } = this.props;

    return (
      <form ref={(node) => { this.rootNode = node; }}>
        {elementReducer({
          schema,
          formData,
          onChange: this.onChange,
        })}
      </form>
    );
  }
}
