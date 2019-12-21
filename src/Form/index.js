import get from 'lodash/get';
import set from 'lodash/set';
import { Typography } from 'material-ui';
import React, { Component } from 'react';
import Input from './Input';
import FormArray from './Array';

window.loGet = get;

const getPrimitive = (type) => {
  switch (type) {
    case 'object':
      return {};
    case 'array':
      return [];
    default:
      return '';
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
          key: `${key}.${prop}`,
        });

        return res;
      }, {});
    case 'array':
      return Array.from(document.getElementById(key).children).map((item, i) => formDataReducer({
        formNode,
        schema: schema.items,
        key: `${key}[${i}]`,
      }));
    case 'color':
    case 'integer':
    case 'range':
    case 'string':
    case 'textarea':
      return get(formNode, `elements["${key}"].value`);
    default:
      return null;
  }
};

const elementReducer = ({
  schema = {},
  formData = getPrimitive(schema.type),
  onChange,
  onSort,
  onRemove,
  onAdd,
  key = 'root',
}) => {
  switch (schema.type) {
    case 'object':
      return [<Typography variant="title" key="__title" gutterBottom>{schema.title}</Typography>].concat((schema.propertyOrder || Object.keys(schema.properties)).map(prop => elementReducer({
        schema: schema.properties[prop],
        formData: formData[prop],
        onChange,
        onSort,
        onAdd,
        onRemove,
        key: `${key}.${prop}`,
      })));
    case 'array':
      return (
        <FormArray
          id={key}
          title={schema.title}
          onSort={onSort(key)}
          onRemove={onRemove(key)}
          onAdd={onAdd(key, schema.items.type)}
          key={key}
        >
          {(formData || []).map((item, i) => (
            <div key={key}>
              {elementReducer({
                schema: schema.items,
                formData: item,
                onChange,
                onSort,
                onRemove,
                onAdd,
                key: `${key}[${i}]`,
              })}
            </div>
          ))}
        </FormArray>
      );
    case 'color':
    case 'integer':
    case 'range':
    case 'string':
    case 'textarea':
      return <Input key={key} id={key} value={formData} onChange={onChange} {...schema} />;
    default:
      return <div data-key={key} />;
  }
};

export default class extends Component {
  constructor(props) {
    super(props);

    this.onChange = () => {
      const formData = formDataReducer({
        formNode: this.rootNode,
        schema: this.props.schema,
      });
      this.props.onChange({ formData });
    };
  }

  componentDidMount() {
    this.onChange();
  }

  // onChange = () => {
  //   const formData = formDataReducer({
  //     formNode: this.rootNode,
  //     schema: this.props.schema,
  //   });
  //   this.props.onChange({ formData });
  // };

  onSort = dataPath => (fromIndex, toIndex) => () => {
    const formData = this.transformData(dataPath, (arr) => {
      arr.splice(toIndex, 0, arr.splice(fromIndex, 1));
      return arr;
    }, []);
    this.props.onChange({ formData });
  };

  onAdd = (dataPath, itemType) => () => {
    const formData = this.transformData(dataPath, (arr) => {
      arr.push(getPrimitive(itemType));
      return arr;
    }, []);
    this.props.onChange({ formData });
  }

  onRemove = dataPath => index => () => {
    const formData = this.transformData(dataPath, (arr) => {
      arr.splice(index, 1);
      return arr;
    }, []);
    this.props.onChange({ formData });
  }

  transformData(dataPath, transform, defaultValue) {
    const formData = {
      root: formDataReducer({
        formNode: this.rootNode,
        schema: this.props.schema,
      }),
    };
    set(formData, dataPath, transform(get(formData, dataPath, defaultValue)));
    return formData.root;
  }

  render() {
    const { schema, formData } = this.props;

    return (
      <form ref={(node) => { this.rootNode = node; }}>
        {elementReducer({
          schema,
          formData,
          onChange: this.onChange,
          onSort: this.onSort,
          onRemove: this.onRemove,
          onAdd: this.onAdd,
        })}
      </form>
    );
  }
}
