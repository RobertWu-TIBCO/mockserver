let routerMap = {}; // 存放路由映射
const glob = require("glob"),
    Router = require("koa-router"),
    debug = require("debug")("mock:server"),
    config = require("config"),
    fp = require("./functions"),
    { resolve } = require("path"),
    { mockFiles, localMockPath, mockApiPrefix } = config,
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
    routerMap[projectApiPath] = projectApiPath;
});

fp.recordApiMap(routerMap);

module.exports = { router };