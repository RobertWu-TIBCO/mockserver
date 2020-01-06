const Koa = require("koa"),
  logger = require("koa-logger"),
  app = new Koa(),
  { router } = require("./mountApi");

app.use(logger());
// register all routes from mountApi
app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
