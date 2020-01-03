const Koa = require("koa");
const logger = require("koa-logger");
const { router } = require("./mountApi");
const app = new Koa();

app.use(logger());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);