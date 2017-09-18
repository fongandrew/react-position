const autoprefixer = require('autoprefixer'),
      path = require('path'),
      webpack = require('webpack'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

// Helper to point to index.ts for aliased files 
const package = name => path.join(
  __dirname, '..', 'packages', name, 'src', 'index.tsx'
);

console.info(package('react-append'))

// Actual config object
let config = {
  entry: {
    app: './src/index.tsx'
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',

    // Add chunkhash for easy cache-invalidation
    filename: 'js/[name]-[chunkhash].js',
    chunkFilename: 'js/[name]-[chunkhash].js'
  },

  module: {
    rules: [

      // CSS / SASS
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function () { return [autoprefixer]; },
              sourceMap: true
            }
          }]
        }) },

      // TypeScript
      { test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader'
        }] },

      // Source map extraction
      { test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre' }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      'react-append': package('react-append'),
      'react-append-anchor': package('react-append-anchor')
    }
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name]--[contenthash].css',
      allChunks: true
    }),

    new HtmlWebpackPlugin({ inject: true })
  ]
};

config.devServer = {
  contentBase: path.join(__dirname, 'public'),
  port: 5000,
  historyApiFallback: true
};

module.exports = config;