import BaseConfig from "./base"
import DevConfig from "./dev"

const NODE_ENV = process.env.NODE_ENV

const WebpackConfig = NODE_ENV === 'prod' ? BaseConfig : { ...BaseConfig, ...DevConfig }

export default WebpackConfig;
