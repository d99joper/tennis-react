// craco.config.js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
      webpackConfig.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000, // Minimum size for a chunk (20 KB)
        maxSize: 200000, // Maximum size for a chunk (200 KB)
      };
      return webpackConfig;
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: "static", // Outputs an HTML file
        openAnalyzer: true, // Automatically opens the report in the browser
      }),
      new HtmlWebpackPlugin({
        preload: [
          { rel: "preload", as: "script", href: "build/static/js/main.92850ddc.js" },
          { rel: "preload", as: "script", href: "build/static/js/280.06445bc8.chunk.js" },
        ],
      }),
    ],
  },
};
