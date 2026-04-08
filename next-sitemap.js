/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://markdoc.zhcndoc.com',
  generateRobotsTxt: true,
  async additionalPaths(config) {
    return [await config.transform(config, '/spec')];
  }
};
