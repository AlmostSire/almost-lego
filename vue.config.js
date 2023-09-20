const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    client: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://47.101.54.239:7001",
        // pathRewrite: {
        //   "^/api": "",
        // },
      },
    },
  },
});
