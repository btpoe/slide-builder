export default {
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
