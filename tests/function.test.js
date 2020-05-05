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
    expect(vPath).toBe("mock/robert/dev");
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

describe("fp parse file and header conetnt to return http headers", () => {
  it("should return http headers if header file is http protocol format", () => {
    const filename =
      "G:\\Projects\\baishan\\mockserver\\api\\cvte\\bak\\httpformat.header";
    const content = fp.safeReadFile(filename).toString();
    console.log(` http format header : ${content}`);
    const httpHeaders = fp.getHTTPHeaders_supportRawHeader(content);
    expect(httpHeaders).toHaveProperty("Location", "https://www.baidu.com");
  });
  it("should return http headers if header file contains a json object", () => {
    const apiHeaderFile =
      "g:\\Projects\\baishan\\mockserver\\api\\hack\\goToKC_401.header";
    const headerStr = fp.safeReadFile(apiHeaderFile);
    debug(`headerStr: ${headerStr}`);
    const folderHeaderFile = fp.getProjectHeaderPath(apiHeaderFile);
    const folderHeaderStr = fp.safeReadFile(folderHeaderFile);
    const headerObj = JSON.parse(headerStr),
      folderHeaderObj = JSON.parse(folderHeaderStr);
    const httpHeaders = _.assign(folderHeaderObj, headerObj);
    expect(httpHeaders).toHaveProperty("x-auth", "wuwufa1992l");
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
