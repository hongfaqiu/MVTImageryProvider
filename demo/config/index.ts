import BaseConfig from "./base"
import DevConfig from "./dev"
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const WebpackConfig = (env: any, argv: { mode: string; }) => {
  if (argv.mode === 'development') {
    return { ...BaseConfig, ...DevConfig }
  }

  if (argv.mode === 'production') {
    BaseConfig.plugins?.push(
      new CleanWebpackPlugin(),
    )
    return BaseConfig;
  }

  return BaseConfig;
};

export default WebpackConfig;
