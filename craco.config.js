

// const webpack = require('webpack');
// const path = require('path');

// module.exports = {
//   webpack: {
//     configure: (webpackConfig, { env, paths }) => {
//       // Define environment variables
//       const envVariables = {
//         'process.env': JSON.stringify(process.env),
//         'process.platform': JSON.stringify('browser'),
//         'process.browser': JSON.stringify(true)
//       };

//       // Add DefinePlugin only once
//       webpackConfig.plugins.push(new webpack.DefinePlugin(envVariables));

//       // Add ProvidePlugin for process
//       webpackConfig.plugins.push(new webpack.ProvidePlugin({
//         process: 'process/browser', // This automatically loads when 'process' is used
//       }));

//       // Configure fallbacks for Node.js core modules and process
//       webpackConfig.resolve.fallback = {
//         fs: false,
//         buffer: require.resolve('buffer/'),
//         crypto: require.resolve('crypto-browserify'),
//         util: require.resolve('util/'),
//         stream: require.resolve('stream-browserify'),
//         process: require.resolve('process/browser'),
//         vm: require.resolve('vm-browserify')
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
      // Define environment variables
      const envVariables = Object.keys(process.env).reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
        return acc;
      }, {});

      envVariables['process.platform'] = JSON.stringify('browser');
      envVariables['process.browser'] = JSON.stringify(true);

      // Add DefinePlugin only once, ensuring no conflicting definitions
      webpackConfig.plugins = webpackConfig.plugins.filter(plugin => !(plugin instanceof webpack.DefinePlugin));
      webpackConfig.plugins.push(new webpack.DefinePlugin(envVariables));

      // Add ProvidePlugin for process
      webpackConfig.plugins.push(new webpack.ProvidePlugin({
        process: 'process/browser', // This automatically loads when 'process' is used
      }));

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



