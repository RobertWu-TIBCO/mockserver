const glob = require("glob");
const { resolve } = require("path");
const Router = require("koa-router");
const config = require("config"),
  fp = require("./functions"),
  localMockPath = config.get("localMockPath");
const router = new Router({ prefix: config.get("mockApiPrefix") });

glob
  .sync(resolve(`./${localMockPath}`, `**/${config.get("mockFiles")}`))
  .forEach((item, i) => {
    const projectApiPath = item && item.split(`./${localMockPath}`)[1];
    router.all(
      projectApiPath,
      fp.registerApiByFolder({ projectApiPath, item })
    );
  });

exports.module = { router };
