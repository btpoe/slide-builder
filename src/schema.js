export default {
  title: 'Slide Builder',
  type: 'object',
  properties: {
    screenWidth: {
      type: 'integer',
      title: 'Screen Width',
      minimum: 280,
      maximum: 4000,
      default: 1440,
    },
    fonts: {
      type: 'array',
      title: 'Fonts',
      items: {
        type: 'string',
      },
    },
    background: {
      type: 'object',
      title: 'Background',
      properties: {
        color: {
          type: 'string',
          title: 'Color',
          default: '#fff',
        },
      },
    },
    boxes: {
      type: 'array',
      title: 'Text Boxes',
      items: {
        type: 'object',
        properties: {
          verticalAlignment: {
            type: 'integer',
            title: 'Vertical Alignment',
            minimum: 0,
            maximum: 100,
            default: 50,
          },
          horizontalAlignment: {
            type: 'integer',
            title: 'Horizontal Alignment',
            minimum: 0,
            maximum: 100,
            default: 50,
          },
          textAlignment: {
            type: 'string',
            title: 'Text Alignment',
            default: 'left',
            enum: [
              'left', 'center', 'right',
            ],
            enumNames: [
              'Left', 'Center', 'Right',
            ],
          },
          color: {
            type: 'string',
            title: 'Color',
          },
          font: {
            type: 'string',
            title: 'Font Family',
          },
          spans: {
            type: 'array',
            title: 'Text Spans',
            items: {
              type: 'object',
              properties: {
                color: {
                  type: 'string',
                  title: 'Color',
                },
                font: {
                  type: 'string',
                  title: 'Font Family',
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

export const uiSchema = {
  screenWidth: {
    'ui:widget': 'range',
    classNames: 'u-sticky',
  },
  background: {
    color: {
      'ui:widget': 'color',
    },
  },
  boxes: {
    items: {
      verticalAlignment: {
        'ui:widget': 'range',
      },
      horizontalAlignment: {
        'ui:widget': 'range',
      },
      color: {
        'ui:widget': 'color',
      },
      spans: {
        items: {
          color: {
            'ui:widget': 'color',
          },
          text: {
            'ui:widget': 'textarea',
          },
        },
      },
    },
  },
};
