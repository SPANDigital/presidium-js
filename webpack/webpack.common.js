const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const buildPath = path.join(__dirname, '../dist');
const buildFileName = 'presidium.js';

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.js'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include: path.join(__dirname, '../src'),
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.css/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'resolve-url'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=img/[name].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.json$/,
        include: path.join(__dirname, '../data'),
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  output: {
    path: buildPath,
    filename: buildFileName,
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
          'PRESIDIUM_HOST': `"${process.env.host}"`
      }
  })],
};
