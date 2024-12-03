const webpack = require('webpack')
require('dotenv').config()

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_MAPBOX_ACCESS_TOKEN: JSON.stringify(
            process.env.VUE_APP_MAPBOX_ACCESS_TOKEN,
          ),
        },
      }),
    ],
  },
}
