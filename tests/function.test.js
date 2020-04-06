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
  fs = require("fs");

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
