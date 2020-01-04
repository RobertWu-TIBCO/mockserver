const debug = require("debug")("mock:server"),
  config = require("config"),
  fs = require("fs"),
  _ = require("lodash"),
  { defaultContentType, routerMapFilename } = config;

const splitFilePathByDot = filePath => _.split(filePath, ".");
const splitFilePathByUnderline = filePath =>
  _.split(splitFilePathByDot(filePath)[0], "_");
const getLastElementInArray = stringArray =>
  stringArray[stringArray.length - 1];
const getFilenameSuffix = filePath =>
  getLastElementInArray(splitFilePathByDot(filePath));
const contentTypeConstsArray = [
  "application/xml",
  "application/json",
  "application/xhtml",
  "application/octo-stream",
  "text/plain"
];

function containsStr(str) {
  return new RegExp(str, "ig").test(this);
}
const getContentTypeByFilenameSuffix = filePath =>
  contentTypeConstsArray.filter(e =>
    containsStr.call(e, getFilenameSuffix(filePath))
  );

const getHttpCodeByFilename = filePath => splitFilePathByUnderline(filePath)[1];

const addApiConfToMap = (projectApiPath, apiConf) => {
  projectApiPath: apiConf;
};

const registerApiByFolder = ({ projectApiPath, item }) => {
  return (ctx, next) => {
    try {
      let jsonStr = fs.readFileSync(item);
      debug(`jsonStr: ${jsonStr}`);
      const apiHeaderFile = item.split(".")[0] + ".header";
      const headerStr =
        fs.existsSync(apiHeaderFile) && fs.readFileSync(apiHeaderFile);
      debug(`headerStr: ${headerStr}`);
      ctx.set("Access-Control-Allow-Origin", "*");
      const { contentType, headers, body, httpCode } = genApiConf({
        projectApiPath,
        jsonStr,
        headerStr
      });
      ctx.res.setHeader("Content-Type", contentType);
      _.forIn(headers, (value, key) => {
        ctx.res.setHeader(key, value);
      });
      ctx.body = body;
      ctx.res.statusCode = httpCode;
    } catch (err) {
      ctx.throw(`服务器错误 : ${JSON.stringify(err)}`, 500);
    }
  };
};

const genApiConf = ({ projectApiPath, jsonStr, headerStr = "{}" }) => {
  const body = jsonStr;
  const headers = JSON.parse(headerStr);
  // _ is used only for httpCode and should not appear in apiPath
  const httpCode =
    (containsStr.call(projectApiPath, "_") &&
      getHttpCodeByFilename(projectApiPath)) ||
    200;
  const contentType = getContentTypeByFilenameSuffix(projectApiPath);
  return {
    contentType: (contentType.length && contentType) || defaultContentType,
    headers,
    body,
    httpCode
  };
};

const recordApiMap = routerMap => {
  // 记录路由
  fs.writeFile(routerMapFilename, JSON.stringify(routerMap, null, 4), err => {
    if (!err) {
      console.log("路由地图生成成功！");
    }
  });
};

const autoParse = () => {
  const acorn = require("acorn");
  const fs = require("fs");
  const program = fs.readFileSync(__filename, "utf8");
  const parsed = acorn.parse(program);
  parsed.body.forEach(fn => {
    if (fn.type.endsWith("VariableDeclaration")) {
      const fnv = fn.declarations[0];
      module.exports[fnv.id.name] = eval(fnv.id.name);
    }
    if (fn.type.endsWith("FunctionDeclaration")) {
      module.exports[fn.id.name] = eval(fn.id.name);
    }
  });
};

autoParse();
