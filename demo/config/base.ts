import path from 'path';
import { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import type { WebpackConfiguration } from "webpack-dev-server";

const cesiumSource = '../node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

const BaseConfig: WebpackConfiguration = {
  entry: {
    index: {
      import: './src/app.tsx',
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      'cesium': path.resolve(__dirname, cesiumSource),
    },
    fallback: {
      fs: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node-modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false
        }
      },
      {
        test:/\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[ext]?[hash]'
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: './public/index.html',
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(__dirname, cesiumSource, cesiumWorkers), to: 'cesium/Workers' },
        { from: path.join(__dirname, cesiumSource, 'Assets'), to: 'cesium/Assets' },
        { from: path.join(__dirname, cesiumSource, 'Widgets'), to: 'cesium/Widgets' },
      ],
    }),
    new DefinePlugin({
        //Cesium载入静态的资源的相对路径
        CESIUM_BASE_URL: JSON.stringify('cesium/')
    }),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'defaultVendors',
        },
        cesium: {
          priority: 2,
          name:"cesium",
          test: /[\\/]node_modules[\\/](cesium)[\\/]/,
        },
        react: {
          priority: 3,
          name:"react",
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    }
  },
  devServer: {
    static: '../dist',      // 开发环境的服务目录
    hot: true
  }
};

export default BaseConfig;
