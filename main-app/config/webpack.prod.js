const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJSON = require("../package.json");
const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js", //for caching issues we use this
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "DataKnol",
      remotes: {
        sidemenu: `datacontrol@${domain}/datacontrol/remoteEntry.js`, //aws domain url
        cards: `fraudcontro@${domain}/fraudcontro/remoteEntry.js`, //aws domain url
        table: `liquiditycontrol@${domain}/liquiditycontrol/remoteEntry.js`,
      },
      shared: packageJSON.dependencies,
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
