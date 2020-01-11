let routerMap = {}; // 存放路由映射
const glob = require("glob"),
  Router = require("koa-router"),
  debug = require("debug")("mock:server"),
  config = require("config"),
  fp = require("./functions"),
  { resolve } = require("path"),
  { mockApiPrefix, mockFileFilter, localMockPath } = config,
  // register route prefix
  router = new Router({ prefix: mockApiPrefix }),
  scanPath = `./${localMockPath}`,
  splitPathPrefix = `/${localMockPath}`,
  filterFiles = `**/${mockFileFilter}`;

debug(
  `mockFileFilter : ${mockFileFilter}, localMockPath : ${localMockPath}, mockApiPrefix : ${mockApiPrefix}`
);
glob.sync(resolve(scanPath, filterFiles)).forEach((item, i) => {
  const projectApiPath = item && item.split(splitPathPrefix)[1];
  debug(`item : ${item},  projectApiPath: ${projectApiPath}`);
  router.all(projectApiPath, fp.registerApiByFolder({ projectApiPath, item }));
  // 记录路由
  // record api map to a json file with relative file path as key and the final mocked api path as value
  routerMap[splitPathPrefix + projectApiPath] = {
    localFile: item,
    mockApiUrl: `http://${fp.showWlanIp()}:${process.env.PORT ||
      3000}${mockApiPrefix}${projectApiPath}`
  };
});

fp.recordApiMap(routerMap);

glob.sync(resolve("./", "routerMap.json")).forEach((item, i) => {
  router.all("/", fp.registerApiByFolder({ projectApiPath: item, item }));
});

module.exports = { router };
