const glob = require("glob");
const { resolve } = require("path");
const Router = require("koa-router");
const config = require("config"),
  fp = require("./functions");
const { mockFiles, localMockPath, mockApiPrefix } = config;
const router = new Router({ prefix: mockApiPrefix });

console.log(
  `mockFiles : ${mockFiles}, localMockPath : ${localMockPath}, mockApiPrefix : ${mockApiPrefix}`
);
glob
  .sync(resolve(`./${localMockPath}`, `**/${mockFiles}`))
  .forEach((item, i) => {
    const projectApiPath = item && item.split(`./${localMockPath}`)[1];
    console.log(`item : ${item}, localMockPath : ${localMockPath}`);
    debugger;
    router.all(
      projectApiPath,
      fp.registerApiByFolder({ projectApiPath, item })
    );
  });

module.exports = { router };
