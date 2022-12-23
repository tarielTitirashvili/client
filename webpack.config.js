const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

console.log('isProd', !isDev)

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.png', '.svg', '.json'],
    // imports are here
    alias: {
      shared: path.resolve(__dirname, 'src/assets'),
      src: path.resolve(__dirname, 'src'),
    }
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 
          isDev ? 'css-loader' : MiniCssExtractPlugin.loader
        ]
      },
      {
        test: /\.(png|svg|jpg)$/,
        use: ['file-loader', ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader',] 
        
      },
    ]
  },
  optimization:{
    splitChunks: {
      chunks: 'all'
    }
  },
  devServer:{
    port: 4200,
    hot: isDev
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin,
    new CopyWebpackPlugin({
      patterns:[
        {
          from: path.resolve(__dirname, 'src/assets/favicon.png'),
          to:  path.resolve(__dirname, 'build')
        }
      ]
    }),
    new HtmlWebpackPlugin(
      {
      template: './src/index.html',
      minify:{
        collapseWhitespace: isProd
      }
    }
    )
  ]
}