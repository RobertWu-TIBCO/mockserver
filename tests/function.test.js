/*
 * @Author: your name
 * @Date: 2020-01-11 21:20:52
 * @LastEditTime : 2020-01-19 17:42:42
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blogg:\Projects\baishan\mockserver\tests\function.test.js
 */
const debug = require("debug")("mock:server"),
  fp = require("../functions"),
  _ = require("lodash"),
  isJson = require("C:\\Users\\Administrator\\AppData\\Local\\Yarn\\Cache\\v6\\npm-validator-10.11.0-003108ea6e9a9874d31ccc9e5006856ccd76b228-integrity\\node_modules\\validator\\lib\\isJSON.js"),
  fs = require("fs");

describe("genApiConf would return correct api mock info", () => {
  it("should return http header correctly even the api header file is not in json format", () => {
    const { contentType, headers, body, httpCode } = fp.genApiConf({
      projectApiPath: "/httpheader/testCvteKong.json",
      item: "g:/Projects/baishan/mockserver/api/httpheader/testCvteKong.json",
    });
    expect(contentType).toBe("application/json");
    expect(httpCode).toBe(200);
    expect(headers).toHaveProperty("Location", "https://www.baidu.com");
    // body is bytes
    // expect(body).toHaveProperty("Address", "Beijing");
  });
});
describe("fp safeReadFile should show file content", () => {
  it("match file content when read a file", () => {
    const rs = fp
      .safeReadFile(
        "G:/Projects/baishan/mockserver/api/hack/project.virtualPath"
      )
      .toString();
    expect(rs).toBe("mock/robert/dev");
  });
});

describe("fp should show project virtual path file content", () => {
  it("should return correct vPath file content", () => {
    const vPath = fp.getProjectVirtualPath(
      "G:/Projects/baishan/mockserver/api/hack/kcResponse.http"
    );
    // the final api url
    expect(vPath).toBe("/mock/robert/dev/kcResponse.http");
    // expect(vPath).toBe("mock/robert/dev");
  });
});

describe("fp should show project virtual path filename", () => {
  it("should return correct vPath filename", () => {
    const vPathFilename = fp.getProjectVirtualPathFilename(
      "G:/Projects/baishan/mockserver/api/hack/kcResponse.http"
    );
    expect(vPathFilename).toBe(
      "G:/Projects/baishan/mockserver/api/hack/project.virtualPath"
    );
  });
});

describe("fp read http file and return http headers", () => {
  it("should return http headers if input is a valid file", () => {
    const filename =
      "G:\\Projects\\baishan\\mockserver\\api\\hack\\kcResponse.http";
    let content = fp.safeReadFile(filename).toString();
    debug(`content : ${content}`);
    const httpHeaders = fp.getHTTPHeaders(content);
    expect(httpHeaders).toMatchObject({
      "Content-Type": "application/json; charset=utf-8",
    });
    expect(httpHeaders).toHaveProperty(
      "Content-Type",
      "application/json; charset=utf-8"
    );
  });
});

describe("fp read http file and return http content-type header", () => {
  it("should return content-type if input is a valid file", () => {
    const filename =
      "G:\\Projects\\baishan\\mockserver\\api\\hack\\kcResponse.http";
    let content = fp.safeReadFile(filename).toString();
    debug(`content : ${content}`);
    const contentType = fp.getHTTPContenttype(content);
    expect(contentType).toBe("application/json; charset=utf-8");
  });
});

describe("fp read http file and return http code", () => {
  it("should return http code if input is a valid file", () => {
    const filename =
      "G:\\Projects\\baishan\\mockserver\\api\\hack\\kcResponse.http";
    let content = fp.safeReadFile(filename).toString();
    debug(`content : ${content}`);
    const httpCode = fp.getHTTPCode(content);
    // content = `hi
    //   nihao

    //   Worker
    //   sleep`;
    // debug(`content : ${content}`);
    expect(httpCode).toBe("201");
  });
});

describe("fp standard http file and return body content", () => {
  it("should return an array result if input is a valid file", () => {
    const filename =
      "G:\\Projects\\baishan\\mockserver\\api\\hack\\kcResponse.http";
    let content = fp.safeReadFile(filename).toString();
    debug(`content : ${content}`);
    const body = fp.getHTTPBody(content);
    debug(`body : ${body}`);
    expect(body).toMatch(
      `{"watchingPage":true,"watchingSpace":true,"watchingBlogs":false,"isAdmin":false,"isBlogPost":false}`
    );
  });
});

describe("fp parse file path and return http code", () => {
  it('should return 401 if file path contains "_401"', () => {
    const filename =
      "g:\\Projects\\baishan\\mockserver\\api\\hack\\goToKC_401.json";
    let httpCode = fp.getHttpCodeByFilename(filename);
    expect(httpCode).toBe("401");
  });
});

describe("test if file content is json or not", () => {
  it("return false if file content is not json ", () => {
    const filename = "g:\\Projects\\baishan\\mockserver\\api\\hack\\empty.json";
    const filecontent = fp.safeReadFile(filename).toString();
    const rs = isJson(filecontent);
    expect(rs).toBe(false);
  });
  it("return true if file content is json ", () => {
    const filename =
      "g:\\Projects\\baishan\\mockserver\\api\\hack\\project.header";
    const filecontent = fp.safeReadFile(filename).toString();
    const rs = isJson(filecontent);
    expect(rs).toBe(true);
  });
});
describe("fp parse file and header conetnt to return http headers", () => {
  it("should return http headers if header file contains json", () => {
    const filename =
      "G:\\Projects\\baishan\\mockserver\\api\\cvte\\bak\\testCvteKong.header";
    const httpHeaders = fp.parseJsonFormatHeader(filename);
    expect(httpHeaders).toHaveProperty("Location", "https://www.baidu.com");
  });
  it("should return http headers if header file is http protocol format", () => {
    const filename =
      "G:\\Projects\\baishan\\mockserver\\api\\cvte\\bak\\httpformat.header";
    const content = fp.safeReadFile(filename).toString();
    console.log(` http format header : ${content}`);
    const httpHeaders = fp.parseHttpRawHeaderFormat(content);
    expect(httpHeaders).toHaveProperty("Location", "https://www.baidu.com");
  });
});

describe("fp get last element in array", () => {
  it("should return last number in a number array", () => {
    const result = fp.getLastElement([1, 4, 8, 5]);
    expect(result).toBe(5);
  });
});

describe("fp get last element index in array", () => {
  it("should return 3 in a number array which has 4 numbers", () => {
    const result = fp.getLastElementIndex([1, 4, 8, 5]);
    expect(result).toBe(3);
  });
});

describe("fp return a valid content-type base on filename suffix", () => {
  it("should return application/json if file path ends with .json", () => {
    const filename =
      "g:\\Projects\\baishan\\mockserver\\api\\hack\\goToKC_401.json";
    const result = fp.getContentTypeByFileSuffix(filename);
    expect(result).toBe("application/json");
  });
});

describe("fp return warning if file content is empty instead of returning false", () => {
  it("return empty string if file does not exist", () => {
    const filename =
      "g:\\Projects\\baishan\\mockserver\\api\\hack\\noSuchFile.json";
    const rs = fp.safeReadFile(filename).toString();
    expect(rs).toBe("");
  });
  it("return file content if file has one line", () => {
    const filename =
      "g:\\Projects\\baishan\\mockserver\\api\\hack\\oneline.json";
    const rs = fp.safeReadFile(filename).toString();
    expect(rs).toMatch("test content");
  });
  it("return empty string instead of false if file exists but has no content", () => {
    const filename = "g:\\Projects\\baishan\\mockserver\\api\\hack\\empty.json";
    const rs = fp.safeReadFile(filename).toString();
    expect(rs).toBe("");
  });
});

describe("should return correct http headers for an item", () => {
  it("should return http headers if project header file contains a json object", () => {
    const item = "C:\\faster\\mockserver_dev\\api\\hack\\project.header";
    const httpHeaders = fp.parseJsonFormatHeader(item);
    expect(httpHeaders).toHaveProperty("x-iac-token", "robert_iac");
  });
  it("should return http headers if header file contains a json object", () => {
    const item = "C:\\faster\\mockserver_dev\\api\\hack\\goToKC_401.header";
    const httpHeaders = fp.parseJsonFormatHeader(item);
    expect(httpHeaders).toHaveProperty("x-auth", "wuwufa1992l");
  });
  it("should return http headers if header file contains a json object", () => {
    let item = "C:\\faster\\mockserver_dev\\api\\hack\\goToKC_401.header";
    const httpHeaders_item = fp.parseJsonFormatHeader(item);
    item = "C:\\faster\\mockserver_dev\\api\\hack\\project.header";
    const httpHeaders_project = fp.parseJsonFormatHeader(item);
    const httpHeaders = _.assign(httpHeaders_item, httpHeaders_project);
    expect(httpHeaders).toHaveProperty("x-auth", "wuwufa1992l");
    expect(httpHeaders).toHaveProperty("x-iac-token", "robert_iac");
  });
  it("should return http headers if item has header file or project header file in http format", () => {
    const item = "C:/faster/mockserver_dev/api/hack/goToKC_401.json";
    const httpHeaders = fp.getItemHTTPHeaders(item);
    expect(httpHeaders).toHaveProperty("x-auth", "wuwufa1992l");
    expect(httpHeaders).toHaveProperty("x-iac-token", "robert_iac");
  });

  it("should return valid http headers and project headers if both header file exist and have json as content", () => {});
});

describe("get valid project or header file path for a valid item", () => {
  it("getProjectHeaderPath should return a valid project header file path", () => {
    const item =
      "g:/Projects/baishan/mockserver/api/httpheader/testCvteKong.json";
    const item_projectHeader = fp.getProjectHeaderPath(item);
    expect(item_projectHeader).toBe(
      "g:/Projects/baishan/mockserver/api/httpheader/project.header"
    );
  });
});

describe("return item file path stat info", () => {
  it("if item is a folder link, should return the info", () => {
    const item = "g:/Projects/baishan/mockserver/api/nifiDoc";
    const rs = fp.isFile(item);
    expect(rs).toBe(false);
  });
});
