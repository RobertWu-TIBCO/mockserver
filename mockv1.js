const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const glob = require("glob");
const { resolve } = require("path");
const fs = require("fs");
const routerMap = {}; // 存放路由映射
const debug = require("debug")("mock:server");

const app = new Koa();
const router = new Router({ prefix: "/api" });

app.use(logger());

glob.sync(resolve("./api", "**/*")).forEach((item, i) => {
  // glob.sync(resolve('./api', "**/*.json")).forEach((item, i) => {
  let apiJsonPath = item && item.split("/api")[1];
  console.log(`item: ${item}, apiJsonPath : ${apiJsonPath}`);
  let apiPath = apiJsonPath;

  router.all(apiPath, (ctx, next) => {
    debug(`  item: ${item}, ctx: ${ctx}`);
    try {
      let jsonStr = fs.readFileSync(item).toString();
      debug(`jsonStr: ${jsonStr}`);
      ctx.body = jsonStr;
      ctx.res.setHeader("Content-Type", "application/xml");
      ctx.set("Access-Control-Allow-Origin", "*");
    } catch (err) {
      ctx.throw("服务器错误", 500);
    }
  });

  routerMap[apiJsonPath] = apiPath;
});

fs.writeFile("./routerMap.json", JSON.stringify(routerMap, null, 4), err => {
  if (!err) {
    console.log("路由地图生成成功！");
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
