// @flow

// #region imports
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// #endregion

// #region constants
const outputPath = path.join(__dirname, 'docs/assets');
const devServerRootPath = path.join(__dirname, 'docs');
const publicPath = '/assets/';
const nodeModulesDir = path.join(__dirname, 'node_modules');
const srcInclude = path.join(__dirname, 'src/front');
const indexFile = path.join(__dirname, 'src/front/index.js');
// #endregion

const config = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    app: ['react-hot-loader/patch', indexFile],
  },
  resolve: {
    modules: ['src/front', 'node_modules'],
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: outputPath,
    publicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: srcInclude,
        exclude: [nodeModulesDir],
        loaders: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          // name(module) {
          //   // get the name. E.g. node_modules/packageName/not/this/part.js
          //   // or node_modules/packageName
          //   const packageName = module.context.match(
          //     /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
          //   )[1];

          //   // npm package names are URL-safe, but some servers don't like @ symbols
          //   return `npm.${packageName.replace('@', '')}`;
          // },
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'src/front/statics/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new ProgressBarPlugin({
      format: 'Build [:bar] :percent (:elapsed seconds)',
      clear: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer: {
    contentBase: devServerRootPath,
    port: 3001,
    hot: true,
    historyApiFallback: true,
  },
};

module.exports = config;
