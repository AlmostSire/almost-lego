const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const isStaging = !!process.env.VUE_APP_STAGING;
const isProduction = process.env.NODE_ENV === "production";
const isAnalyze = !!process.env.ANALYZE_MODE;

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    client: {
      overlay: false,
    },
    port: 8081,
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:7001",
    //     // pathRewrite: {
    //     //   "^/api": "",
    //     // },
    //   },
    // },
  },
  // 生产环境要使用 OSS 地址
  // 其他环境都是用绝对路径
  publicPath:
    isProduction && !isStaging ? "https://oss.imooc-lego.com/editor" : "/",
  configureWebpack: (config) => {
    if (isAnalyze) {
      config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "static" }));
    }
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: /\.js$|\.html$|\.css/,
          threshold: 1024,
        })
      );
    }
    config.optimization.splitChunks = {
      maxInitialRequests: 30,
      minSize: 300 * 1024,
      chunks: "all",
      cacheGroups: {
        antVendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const result = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            );
            if (result && result[1]) {
              return `npm.${result[1].replace("@", "")}`;
            }

            const moduleFileName = module
              .identifier()
              .split("/")
              .reduceRight((item) => item);
            const allChunksNames = chunks.map((item) => item.name).join("~");

            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
          },
        },
      },
    };
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "慕课乐高";
      args[0].desc = "一键生成 H5 海报";
      return args;
    });
  },
});
