const debug = require("debug")("mock:server");
const config = require("config");
const _ = require("lodash");
const { defaultContentType, routerMapFilename } = config;
const fs = require("fs");

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
    debug(` projectApiPath : ${projectApiPath}, item: ${item}, ctx: ${ctx}`);
    // try {
    // let jsonStr = fs.readFileSync(item).toString();
    let jsonStr = { age: 12 };
    debug(`jsonStr: ${jsonStr}`);
    const headerStr = { name: "rob" };
    // const headerStr = fs
    // .readFileSync(item.split(".")[0] + ".header")
    // .toString();
    ctx.set("Access-Control-Allow-Origin", "*");
    // genApiConf({ projectApiPath, jsonStr, ctx });
    const apiConf = genApiConf({ projectApiPath, jsonStr, headerStr });
    ctx.body = apiConf.body;
    ctx.res.setHeader(
      "Content-Type",
      getContentTypeByFilenameSuffix(projectApiPath) || defaultContentType
    );
    // routerMap[projectApiPath] = apiConf;
    // } catch (err) {
    //   ctx.throw(`服务器错误 : ${JSON.stringify(err)}`, 500);
    // }
  };
};

const genApiConf = ({ projectApiPath, jsonStr, headerStr }) => {
  const body = jsonStr;
  const headers = headerStr;
  const httpCode = getHttpCodeByFilename(projectApiPath);
  return { headers, body, httpCode };
};

// const genApiConf = ({ projectApiPath, jsonStr, ctx }) => {
//   // ctx.body = setCtxBody(jsonStr)[config.get(setCtxBodyPolicy)]
//   ctx.body = jsonStr;
//   ctx.set("Access-Control-Allow-Origin", "*");
//   ctx.res.setHeader(
//     "Content-Type",
//     getContentTypeByFilenameSuffix(projectApiPath) || defaultContentType
//   );
// };
// const contentTypeConsts = ["xml", "json", "text/plain"];
// const contentTypeJudge = projectApiPath.split("/")[1];
// debug(`contentTypeJudge: ${contentTypeJudge}`);
// console.log(contentTypeJudge);
// ctx.res.setHeader("Content-Type", `application/${contentTypeJudge}`);

// const setCtxBody = ({ jsonStr}) => {
//   "packagedContent" : {
//     "data": JSON.parse(jsonStr),
//     "state": 200,
//     "type": "success" // 自定义响应体
//   },
//   "flatContent": jsonStr;
// };

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
