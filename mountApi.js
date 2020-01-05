let routerMap = {}; // 存放路由映射
const glob = require("glob"),
  Router = require("koa-router"),
  debug = require("debug")("mock:server"),
  config = require("config"),
  fp = require("./functions"),
  { resolve } = require("path"),
  { mockApiPrefix, mockFiles, localMockPath } = config,
  // register route prefix
  router = new Router({ prefix: mockApiPrefix }),
  scanPath = `./${localMockPath}`,
  splitPathPrefix = `/${localMockPath}`,
  filterFiles = `**/${mockFiles}`;

debug(
  `mockFiles : ${mockFiles}, localMockPath : ${localMockPath}, mockApiPrefix : ${mockApiPrefix}`
);
glob.sync(resolve(scanPath, filterFiles)).forEach((item, i) => {
  const projectApiPath = item && item.split(splitPathPrefix)[1];
  debug(`item : ${item},  projectApiPath: ${projectApiPath}`);
  router.all(projectApiPath, fp.registerApiByFolder({ projectApiPath, item }));
  // key is the file path, value is the final mocked api path
  routerMap[splitPathPrefix + projectApiPath] = mockApiPrefix + projectApiPath;
});

fp.recordApiMap(routerMap);

module.exports = { router };
