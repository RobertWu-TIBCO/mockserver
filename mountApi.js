let routerMap = {}; // 存放路由映射
const glob = require("glob"),
  Router = require("koa-router"),
  debug = require("debug")("mock:server"),
  config = require("config"),
  fp = require("./functions"),
  { resolve } = require("path"),
  {
    mockApiPrefix,
    mockFileFilter,
    localMockPath,
    routerMapFilename,
    useTestBash
  } = config,
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
  const mockApiUrl = `http://${fp.showWlanIp()}:${process.env.PORT ||
    3000}${mockApiPrefix}${projectApiPath}`;

  routerMap[splitPathPrefix + projectApiPath] = useTestBash
    ? mockApiUrl
    : {
        localFile: item,
        mockApiUrl
      };
});

fp.recordApiMap(routerMap);

glob.sync(resolve("./", routerMapFilename)).forEach((item, i) => {
  router.all("/", fp.registerApiByFolder({ projectApiPath: item, item }));
});

module.exports = { router };
