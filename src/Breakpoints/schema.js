import React from 'react';

export const ref = {
  globalIdentity: 1,
};

export default {
  type: 'object',
  properties: {
    screenWidth: {
      'ui:widget': 'range',
      type: 'range',
      title: 'Screen Width',
      minimum: 0,
      maximum: 4000,
    },
    background: {
      type: 'object',
      title: 'Background',
      properties: {
        image: {
          type: 'string',
          title: 'Image',
        },
        verticalAlignment: {
          type: 'range',
          title: 'Vertical Focal Point (%)',
          minimum: 0,
          maximum: 100,
        },
        horizontalAlignment: {
          type: 'range',
          title: 'Horizontal Focal Point (%)',
          minimum: 0,
          maximum: 100,
        },
      },
    },
    boxes: {
      type: 'array',
      title: 'Text Boxes',
      items: {
        type: 'object',
        properties: {
          identity: {
            type: 'integer',
            'ui:widget': props => (
              <input
                type="hidden"
                value={props.value || (props.onChange(++ref.globalIdentity), ref.globalIdentity)}
              />
            ),
            'ui:options': {
              label: false,
            },
          },
          verticalAlignment: {
            type: 'range',
            title: 'Vertical Alignment (%)',
            minimum: 0,
            maximum: 100,
          },
          horizontalAlignment: {
            type: 'range',
            title: 'Horizontal Alignment (%)',
            minimum: 0,
            maximum: 100,
          },
          textAlignment: {
            type: 'string',
            title: 'Text Alignment',
            enum: [
              '', 'left', 'center', 'right',
            ],
            enumNames: [
              'Inherit From Previous Breakpoint', 'Left', 'Center', 'Right',
            ],
          },
          color: {
            type: 'color',
            title: 'Color',
          },
          fontFamily: {
            type: 'string',
            title: 'Font Family',
          },
          fontSize: {
            type: 'integer',
            title: 'Font Size (px)',
          },
          spans: {
            type: 'array',
            title: 'Text Spans',
            items: {
              type: 'object',
              properties: {
                identity: {
                  type: 'integer',
                  'ui:widget': props => (
                    <input
                      type="hidden"
                      value={
                        props.value || (props.onChange(++ref.globalIdentity), ref.globalIdentity)
                      }
                    />
                  ),
                  'ui:options': {
                    label: false,
                  },
                },
                color: {
                  type: 'color',
                  title: 'Color',
                },
                fontFamily: {
                  type: 'string',
                  title: 'Font Family',
                },
                fontSize: {
                  type: 'range',
                  title: 'Font Size (px)',
                },
                text: {
                  type: 'textarea',
                  title: 'Text',
                },
              },
            },
          },
        },
      },
    },
  },
};
