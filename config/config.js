export default {
  history: "hash",
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ["umi-plugin-react", {
      locale: {
        default: "en-US",
        baseNavigator: true,
        antd: true,
      },
      antd: false,
      dva: {
        immer: true
      },
      dynamicImport: false,
      title: "UMI-JS",
      dll: false,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  define: {
    API_ENDPOINT: "localhost",
  }
};
