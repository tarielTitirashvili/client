const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

console.log('isProd', !isDev)

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: filename('js'),
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
          MiniCssExtractPlugin.loader,
          'css-loader'
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
    new MiniCssExtractPlugin({
      filename: filename('css'),
      // runtime: isProd,
    }),
    new CopyWebpackPlugin({
      patterns:[
        {
          from: path.resolve(__dirname, 'src/assets/favicon.png'),
          to:  path.resolve(__dirname, 'build')
        },
        {
          from: path.resolve(__dirname, 'src/assets'),
          to:  path.resolve(__dirname, 'build/assets')
        }
      ]
    }),
    new HtmlWebpackPlugin(
      {
      template: './src/index.html',
      minify:{
        collapseWhitespace: isProd
      }
    },
    ),
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          "default",
          {
            discardComments: { removeAll: true },
          },
        ],
      },
    }),
  ]
}

