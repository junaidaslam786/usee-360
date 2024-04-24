// const path = require('path');

// module.exports = {
//   webpack: {
//     configure: (webpackConfig, { env, paths }) => {
//       webpackConfig.resolve.fallback = {
//         fs: false, // Most web browsers don't have the 'fs' module
//         buffer: require.resolve('buffer/'),
//         crypto: require.resolve('crypto-browserify'),
//         util: require.resolve('util/'),
//         stream: require.resolve('stream-browserify')
//       };
//       return webpackConfig;
//     }
//   }
// };

const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Define `process.env` and other necessary process variables
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser', // This automatically loads when 'process' is used
        }),
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(process.env),
          'process.platform': JSON.stringify('browser'),
          'process.browser': JSON.stringify(true)
        })
      ];

      // Configure fallbacks for Node.js core modules and process
      webpackConfig.resolve.fallback = {
        fs: false,
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser'),
        vm: require.resolve('vm-browserify')
      };

      return webpackConfig;
    }
  }
};


