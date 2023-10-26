// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        timers: require.resolve('timers-browserify'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
        dns: require.resolve('dns'),
        net: require.resolve('net'),
        tls: require.resolve('tls'),
        os: require.resolve('os-browserify/browser'),
      };
      return webpackConfig;
    },
  },
};
