import type { WebpackConfiguration } from "webpack-dev-server";

const DevConfig: WebpackConfiguration = {
  optimization: {
    minimize: false
  },
  devtool: "source-map"
}

export default DevConfig;
