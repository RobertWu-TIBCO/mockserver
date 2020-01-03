const Koa = require("koa"),
    logger = require("koa-logger"),
    app = new Koa(),
    { router } = require("./mountApi");

app.use(logger());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);