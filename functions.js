const debug = require("debug")("mock:server"),
  config = require("config"),
  fs = require("fs"),
  _ = require("lodash"),
  { defaultContentType, routerMapFilename, mergeFolderHeader } = config;

const splitFilePathByDot = filePath => _.split(filePath, ".");
const splitFilePathByUnderline = filePath =>
  _.split(splitFilePathByDot(filePath)[0], "_");
const getLastElementInArray = stringArray =>
  stringArray[stringArray.length - 1];
const getLastElementIndex = stringArray => stringArray.length - 1;
const replaceLastElementInArray = (stringArray, replacedElement) =>
  (stringArray[stringArray.length - 1] = replacedElement);
const getFilenameSuffix = filePath =>
  getLastElementInArray(splitFilePathByDot(filePath));
const contentTypeConstsArray = [
  "application/xml",
  "application/json",
  "application/xhtml",
  "application/octet-stream",
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

const getProjectHeaderPath = apiHeaderFile => {
  let apiHeaderSplitArray = apiHeaderFile.split("/");
  replaceLastElementInArray(apiHeaderSplitArray, "project.header");
  return apiHeaderSplitArray.join("/");
};

const safeReadFile = filePath =>
  fs.existsSync(filePath) && fs.readFileSync(filePath);

const registerApiByFolder = ({ projectApiPath, item }) => {
  return (ctx, next) => {
    try {
      const { contentType, headers, body, httpCode } = genApiConf({
        projectApiPath,
        item
      });
      ctx.set("Access-Control-Allow-Origin", "*");
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

const genApiConf = ({ projectApiPath, item }) => {
  const apiHeaderFile = item.split(".")[0] + ".header";
  const headerStr = safeReadFile(apiHeaderFile);
  debug(`headerStr: ${headerStr}`);
  const folderHeaderFile = getProjectHeaderPath(apiHeaderFile);
  const folderHeaderStr = mergeFolderHeader && safeReadFile(folderHeaderFile);
  const headerObj = JSON.parse(headerStr),
    folderHeaderObj = JSON.parse(folderHeaderStr);
  const headers = _.assign(folderHeaderObj, headerObj);
  // _ is used only for httpCode and should not appear in apiPath
  const httpCode =
    (containsStr.call(projectApiPath, "_") &&
      getHttpCodeByFilename(projectApiPath)) ||
    200;
  const contentType = getContentTypeByFilenameSuffix(projectApiPath);
  return {
    contentType: (contentType.length && contentType) || defaultContentType,
    headers,
    body: safeReadFile(item),
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
