import BaseConfig from "./base"
import DevConfig from "./dev"
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

const WebpackConfig = (env: any, argv: { mode: string; }) => {
  if (argv.mode === 'development') {
    return { ...BaseConfig, ...DevConfig }
  }

  if (argv.mode === 'production') {
    if(BaseConfig.optimization) BaseConfig.optimization.minimize = true;
    BaseConfig.plugins?.push(
      new CleanWebpackPlugin(),
      // gzip
      new CompressionPlugin({
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8
      })
    )
    return BaseConfig;
  }

  return BaseConfig;
};

export default WebpackConfig;
