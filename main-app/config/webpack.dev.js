const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJSON = require("../package.json");

// Helper function to combine dependencies and devDependencies
const combinedDependencies = {
  ...packageJSON.dependencies,
  ...packageJSON.devDependencies,
};

const devConfig = {
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  output: {
    publicPath: "/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "main",
      filename: "remoteEntry.js",
      remotes: {
        datacontrol: "datacontrol@http://localhost:3001/remoteEntry.js",
        fraudcontrol: "fraudcontrol@http://localhost:3003/remoteEntry.js",
        liquiditycontrol:
          "liquiditycontrol@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: combinedDependencies.react,
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: combinedDependencies["react-dom"],
        },
        ...combinedDependencies,
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
