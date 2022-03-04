import BaseConfig from "./base"
import DevConfig from "./dev"
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const WebpackConfig = (env: any, argv: { mode: string; }) => {
  if (argv.mode === 'development') {
    return { ...BaseConfig, ...DevConfig }
  }

  if (argv.mode === 'production') {
    BaseConfig.plugins?.push(
      new CleanWebpackPlugin(),
      new BundleAnalyzerPlugin()
    )
    return BaseConfig;
  }

  return BaseConfig;
};

export default WebpackConfig;
