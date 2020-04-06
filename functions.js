const debug = require("debug")("mock:server"),
  config = require("config"),
  fs = require("fs"),
  os = require("os"),
  _ = require("lodash"),
  {
    defaultContentType,
    routerMapFilename,
    mergeFolderHeader,
    supportHttpProtocol,
  } = config;

const splitPathByDot = (filePath) => _.split(filePath, ".");
const splitPathByUnderline = (filePath) =>
  _.split(splitPathByDot(filePath)[0], "_");
const getLastElement = (array) => array[array.length - 1];
const getLastElementIndex = (array) => array.length - 1;
const replaceLastElement = (array, updateElement) =>
  (array[array.length - 1] = updateElement);
const getFileSuffix = (filePath) => getLastElement(splitPathByDot(filePath));
const contentTypeConstsArray = [
  "application/xml",
  "application/json",
  "application/xhtml",
  "application/octet-stream",
  "text/plain",
];

function containsStr(str) {
  return new RegExp(str, "ig").test(this);
}

// FIXED: test file shows this is an array, even only one element
const getContentTypeByFileSuffix = (filePath) => {
  const contentType = contentTypeConstsArray.filter((e) =>
    containsStr.call(e, getFileSuffix(filePath))
  );
  return (contentType.length && contentType[0]) || defaultContentType;
};

const getHttpCodeByFilename = (filePath) => splitPathByUnderline(filePath)[1];

const addApiConfToMap = (projectApiPath, apiConf) => {
  projectApiPath: apiConf;
};

const splitMultiLines = (fileContent) => {
  const contentSplit = fileContent.split(/\r?\n/);
  debug(`contentSplit: ${contentSplit}`);
  return contentSplit;
};

const getHTTPBody = (fileContent) => {
  const content = splitMultiLines(fileContent);
  const bodyLineIndex = content.indexOf("");
  return content[3];
};

const getHTTPHeaders = (fileContent) => {
  const content = splitMultiLines(fileContent);
  let httpHeaderMap = {};
  contentHeaders = [content[1]];
  contentHeaders.forEach((e) => {
    headeKV = e.split(":");
    httpHeaderMap[headeKV[0]] = headeKV[1];
  });
  return httpHeaderMap;
};

const getHTTPCode = (fileContent) => {
  const firstLine = splitMultiLines(fileContent)[0];
  const httpCode = firstLine.split(" ")[1];
  return httpCode;
};
const getHTTPContenttype = (fileContent) => {
  const content = splitMultiLines(fileContent);
  const contentType = "application/json";
  return contentType;
};

const getProjectHeaderPath = (apiHeaderFile) => {
  let apiHeaderSplitArray = apiHeaderFile.split("/");
  replaceLastElement(apiHeaderSplitArray, "project.header");
  return apiHeaderSplitArray.join("/");
};

const safeReadFile = (filePath) =>
  fs.existsSync(filePath) && fs.readFileSync(filePath);

const registerApiByFolder = ({ projectApiPath, item }) => {
  return (ctx, next) => {
    try {
      const { contentType, headers, body, httpCode } =
        supportHttpProtocol && containsStr.call(projectApiPath, ".http")
          ? standardHTTP({ projectApiPath, item })
          : genApiConf({ projectApiPath, item });
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

const standardHTTP = ({ projectApiPath, item }) => {
  const httpFileContent = safeReadFile(item).toString();
  const body = getHTTPBody(httpFileContent);
  const headers = getHTTPHeaders(httpFileContent);
  const httpCode = getHTTPCode(httpFileContent) || 200;
  const contentType = getHTTPContenttype(httpFileContent) || defaultContentType;
  return {
    contentType,
    headers,
    body,
    httpCode,
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
  return {
    contentType: getContentTypeByFileSuffix(projectApiPath),
    headers,
    body: safeReadFile(item),
    httpCode,
  };
};

const recordApiMap = (routerMap) => {
  fs.writeFile(routerMapFilename, JSON.stringify(routerMap, null, 4), (err) => {
    if (!err) {
      console.log("路由地图生成成功！");
    }
  });
};

const all_interfaces = os.networkInterfaces();

const ethIp =
  all_interfaces.eth0 &&
  all_interfaces.eth0[0] &&
  all_interfaces.eth0[0].address;

const wlanIp0 =
  all_interfaces.WLAN &&
  all_interfaces.WLAN[0] &&
  all_interfaces.WLAN[0].address;

const wlanIp1 =
  all_interfaces.WLAN &&
  all_interfaces.WLAN[1] &&
  all_interfaces.WLAN[1].address;

const getIpv4Ips = () => {
  const ip = _(all_interfaces)
    .flatMap()
    .filter((e) => /ipv4/gi.test(e.family))
    .map((e) => e.address)
    .forEach((e) => console.log(` ipv4 ips : ${e}`));

  return ip;
};

const getServerIp = (interface) => {
  const ip = _(all_interfaces[interface])
    .filter((e) => /ipv4/gi.test(e.family))
    .map((e) => e.address)
    .forEach((e) => debug(`your server ip is: ${e}`));
  return ip;
};

const showWlanIp = () => {
  // const ip = ethIp || (/[a-z]/gi.test(wlanIp0) ? wlanIp1 : wlanIp0);
  const ip = _(all_interfaces.WLAN)
    .filter((e) => /ipv4/gi.test(e.family))
    .map((e) => e.address)
    .forEach((e) => debug(`your wlan ip is: ${e}`));
  // debug(`your wlan ip is: ${ip}`);
  return ip;
};

const autoParse = () => {
  const acorn = require("acorn");
  const fs = require("fs");
  const program = fs.readFileSync(__filename, "utf8");
  const parsed = acorn.parse(program);
  parsed.body.forEach((fn) => {
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

showWlanIp();
