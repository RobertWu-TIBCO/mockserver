/*
 * @Author: your name
 * @Date: 2020-01-11 21:20:52
 * @LastEditTime : 2020-01-17 17:02:26
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blogg:\Projects\baishan\mockserver\tests\function.test.js
 */
const debug = require("debug")("mock:server"),
  fp = require("../functions"),
  fs = require("fs");

describe("fp read file", () => {
  it("should return file content if input is a valid file", () => {
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
    // expect(content).toBe(``);
    expect(httpCode).toBe("201");
  });
});

describe("fp standard http file", () => {
  it("should return an array result if input is a valid file", () => {
    const filename =
      "G:\\Projects\\baishan\\mockserver\\api\\hack\\kcResponse.http";
    let content = fp.safeReadFile(filename).toString();
    debug(`content : ${content}`);
    // content = `hi
    //   nihao

    //   Worker
    //   sleep`;
    // debug(`content : ${content}`);
    const body = fp.getHTTPBody(content);
    debug(`body : ${body}`);
    expect(JSON.parse(body).watchingSpace).toBe(true);
    const rb = content.split(/^$/);
    debug(`rb: ${rb}`);
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
