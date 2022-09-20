const withAntdLess = require("next-plugin-antd-less");

module.exports = withAntdLess({
  lessVarsFilePath: "./assets/less/antd-custom-theme.less",
  devIndicators: {
    autoPrerender: false
  },
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
        permanent: true
      },
      {
        source: '/robots.txt',
        destination: '/api/robots.txt',
        permanent: true
      }
    ]
  }
});
