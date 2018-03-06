import React from 'react';

export default {
  type: 'object',
  properties: {
    screenWidth: {
      type: 'integer',
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
          type: 'integer',
          title: 'Vertical Focal Point (%)',
          minimum: 0,
          maximum: 100,
        },
        horizontalAlignment: {
          type: 'integer',
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
          },
          verticalAlignment: {
            type: 'integer',
            title: 'Vertical Alignment (%)',
            minimum: 0,
            maximum: 100,
          },
          horizontalAlignment: {
            type: 'integer',
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
            type: 'string',
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
                },
                color: {
                  type: 'string',
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
                text: {
                  type: 'string',
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

export const ref = {
  globalIdentity: 1,
};

export const uiSchema = {
  screenWidth: {
    'ui:widget': 'range',
  },
  // background: {
  //   verticalAlignment: {
  //     'ui:widget': 'range',
  //   },
  //   horizontalAlignment: {
  //     'ui:widget': 'range',
  //   },
  // },
  boxes: {
    items: {
      identity: {
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
      // verticalAlignment: {
      //   'ui:widget': 'range',
      // },
      // horizontalAlignment: {
      //   'ui:widget': 'range',
      // },
      // color: {
      //   'ui:widget': 'color',
      // },
      // fontSize: {
      //   'ui:widget': 'range',
      // },
      spans: {
        items: {
          identity: {
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
          // color: {
          //   'ui:widget': 'color',
          // },
          // fontSize: {
          //   'ui:widget': 'range',
          // },
          text: {
            'ui:widget': 'textarea',
          },
        },
      },
    },
  },
};

export const globalsSchema = {
  type: 'object',
  title: 'Slide Builder',
  properties: {
    slideName: {
      type: 'string',
      title: 'Slide Name',
    },
    fonts: {
      type: 'array',
      title: 'Fonts',
      items: {
        type: 'string',
      },
    },
  },
};

export const globalsUiSchema = {
};
