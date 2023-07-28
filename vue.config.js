// vue.config.js
const path = require("path");
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias // 添加别名
      .set("@components", resolve("components"))
      .set("@utils", resolve("src/utils"))
      .set("@constant", resolve("src/constant"))
      .set("@images", resolve("static/images"))
      .set("@api", resolve("api"))
      .set("@src", resolve("src"))
      .set("@store", resolve("store"))
      .set("@uni_modules", resolve("uni_modules"));
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://10.20.113.206:8200",
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },

  // configureWebpack: {
  // 	plugins: [
  // 		new CopyWebpackPlugin([{
  // 			from: path.join(__dirname, '/static'),
  // 			to: path.join(__dirname + '/unpackage/', 'dist', process.env
  // 				.NODE_ENV === 'production' ? 'build' : 'dev', process.env
  // 				.UNI_PLATFORM, '/')
  // 		}])
  // 	]
  // }
};
