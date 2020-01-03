const glob = require("glob");
const { resolve } = require("path");
const Router = require("koa-router");
const debug = require("debug")("mock:server");
const config = require("config"),
  fp = require("./functions");
const { mockFiles, localMockPath, mockApiPrefix } = config;
const scanPath = `./${localMockPath}`,
  splitPathPrefix = `/${localMockPath}`,
  filterFiles = `**/${mockFiles}`;
const router = new Router({ prefix: mockApiPrefix });
let routerMap = {}; // 存放路由映射

debug(
  `mockFiles : ${mockFiles}, localMockPath : ${localMockPath}, mockApiPrefix : ${mockApiPrefix}`
);
glob.sync(resolve(scanPath, filterFiles)).forEach((item, i) => {
  const projectApiPath = item && item.split(splitPathPrefix)[1];
  debug(`item : ${item},  projectApiPath: ${projectApiPath}`);
  router.all(projectApiPath, fp.registerApiByFolder({ projectApiPath, item }));
  routerMap[projectApiPath] = projectApiPath;
});

fp.recordApiMap(routerMap);

module.exports = { router };
