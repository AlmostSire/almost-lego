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
        target: "http://localhost:7001",
        // pathRewrite: {
        //   "^/api": "",
        // },
      },
    },
  },
});
