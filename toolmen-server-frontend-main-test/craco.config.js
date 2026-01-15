const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@select-single-item-height-lg": "75px" , "@primary-color": "#3b82f6"},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};