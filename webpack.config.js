const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },

  devtool: 'source-map',

  devServer: {
    compress: true,
    port: 3000,
  },

  module: {
    rules: [{
      test: /\.(scss|css)$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    },
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
    {
      test: /\.html$/i,
      loader: "html-loader",
    }],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
