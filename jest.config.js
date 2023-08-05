module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  // 下面非要从重要, 将不忽略 lodash-es, other-es-lib 这些es库, 从而使babel-jest去处理它们
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(lodash-es|rgb-hex|axios))",
  ],
};
