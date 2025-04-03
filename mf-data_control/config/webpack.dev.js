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
    port: 3001,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images", // output folder
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "datacontrol",
      filename: "remoteEntry.js",
      exposes: {
        "./DataControlApp": "./src/bootstrap",
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
