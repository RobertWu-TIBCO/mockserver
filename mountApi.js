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
    useTestBash,
    enableRootIndexMount,
    isServerWifiEnabled,
    serverNetInterfaceName,
    useProjectVirtualPath,
    hideFileFilter,
    enableHideFileFilter,
    enableTopLevelIndexMount,
  } = config,
  // register route prefix
  router = new Router({ prefix: mockApiPrefix }),
  indexRouter = new Router(),
  scanPath = `./${localMockPath}`,
  splitPathPrefix = `/${localMockPath}`,
  filterFiles = `**/${mockFileFilter}`;

debug(
  `mockFileFilter : ${mockFileFilter}, localMockPath : ${localMockPath}, mockApiPrefix : ${mockApiPrefix}`
);
glob.sync(resolve(scanPath, filterFiles)).forEach((item, i) => {
  // if is dir then return
  if (fp.isDir(item)) return;
  // hide api setting files
  if (enableHideFileFilter && hideFileFilter.includes(item.split(".")[1]))
    return;

  const shouldUseVPath =
    useProjectVirtualPath && fp.existsProjectVirtualPath(item);

  // item:  "g:/Projects/baishan/mockserver/api/hack"
  // projectApiPath : "/hack"
  let projectApiPath = item && item.split(splitPathPrefix)[1];

  projectApiPath = shouldUseVPath
    ? fp.getProjectVirtualPath(item)
    : projectApiPath;

  debug(`item : ${item},  projectApiPath: ${projectApiPath}`);

  router.all(projectApiPath, fp.registerApiByFolder({ projectApiPath, item }));
  // 记录路由
  // record api map to a json file with relative file path as key and the final mocked api path as value
  const mockApiUrl = `http://${
    isServerWifiEnabled
      ? fp.showWlanIp()
      : fp.getServerIp(serverNetInterfaceName)
  }:${process.env.PORT || 3000}${mockApiPrefix}${projectApiPath}`;

  routerMap[splitPathPrefix + projectApiPath] = useTestBash
    ? mockApiUrl
    : {
        localFile: item,
        mockApiUrl,
      };
});

fp.recordApiMap(routerMap);

glob.sync(resolve("./", routerMapFilename)).forEach((item, i) => {
  router.all("/", fp.registerApiByFolder({ projectApiPath: item, item }));
  // mount root for easy access
  enableRootIndexMount
    ? indexRouter.get(
        "/apis",
        fp.registerApiByFolder({ projectApiPath: item, item })
      )
    : console.log(`root index /apis mount : ${enableRootIndexMount}`);

  // mount / only if mock api prefix used
  mockApiPrefix
    ? indexRouter.get(
        "/",
        fp.registerApiByFolder({ projectApiPath: item, item })
      )
    : console.log(`root index / already mounted `);
});

enableTopLevelIndexMount
  ? indexRouter.get("/top", fp.mountTopLevelIndex(routerMap))
  : console.log(`root index /top mount : ${enableTopLevelIndexMount}`);

module.exports = { router, indexRouter };
