# mock server

A tiny nodejs framework using koa routers to map local folder and files to mock apis .

Allows custom http code, headers, body, content-type by file name and extensions.

## mock server advantages

- [x] register all api base on file path and name
- [x] support http header content-type by file name extension and default content-type, i.e, "users.json" or "alter.xml" set to "application/json" or "application/xml"
- [x] support file content mapping as api response body
- [ ] support response body warp base on file content
- [ ] support user defined delimiter to get httpCode from filename, i.e, dot instead of underline
- [x] support custom project virtual path in final api url
- [x] support one .http file as a full http response, containing http code, headers and body
- [x] support mock index url(i.e, http://localhost:3000/mock/) to show all mock urls in response content
- [x] support http code by file name like "gotoKC_302.json", setting http code to 302
- [x] support user specific http header by file name like "gotoKc_302.header" , also inherit from "project.header" as project scope http headers
- [x] support custom mock api prefix by mockApiPrefix in config module
- [x] support custom file scan filter by mockFileFilter in config module
- [x] support custom scan path by localMockPath in config module
- [x] support control of inherit from project header file by mergeFolderHeader

## start

```
npm install

npm i -g nodemon

nodemon app.js
```

## start with different NODE_ENV

```
PORT=3000 NODE_ENV=orchsymDoc npm start
PORT=4000 NODE_ENV=nifiDoc npm start
PORT=5000 NODE_ENV=nifiComponentDoc npm start
PORT=8000 NODE_ENV=api npm start
PORT=9000 NODE_ENV=allFolders npm start
```

## test apis

`bash testAllApis.sh`

## HTTP Index only shows mapped file and mock url (ejs index may be updated in future)

http://localhost:3000/mock/

## project use examples

### read user defined env variables mockFileFilter, localMockPath, mockApiPrefix to define which folder and files to scan and map to apis

```
// mock api prefix will show up in final url as prefix
"mockApiPrefix": "/mock",

// file filter, i.e, `*, *.json, *.xml`
"mockFileFilter": "\*.json",

// local scan path, set the folder to scan for api mock files
"localMockPath": "api",
```

#### local file :

"/api/hack/user1_302.json"

#### mapped api url:

"/mock/hack/user1_302.json"

#### final mock url:

http://localhost:3000/mock/hack/user1_302.json

### record file path and the final api url in user specified routerMapFilename

> i.e,
> "routerMapFilename": "./routerMap.json",

### set http header Content-Type by file extension or the defaultContentType

> i.e,
> "/api/hack/user1_302.json", get "Content-Type: application/json"

### set final api url with mockApiPrefix and the full file name, including the file extension

```
"mockApiPrefix": "/mock", // mock api prefix will show up in final url as prefix

local file : mapped api url
"/api/hack/user1_302.json": "/mock/hack/user1_302.json"

result:
http://localhost:3000/mock/hack/user1_302.json
```

### set api http header by api file base name related ".header", also inherit from "project.header" file

i.e,

- user1_302.json
- user1_302.header

#### header content

```bash
1140 $ cat user1_302.header
{
    "token":"QiagNT12rRz7y9",
    "location":"http://localhost:8899"
}
```

```bash
1143 $ cat project.header
{
    "x-iac-token": "robert_iac"
}
```

#### body content

```bash
1141 $ cat user1_302.json
{
    "name": "wuyang",
    "age": 27,
    "addr": "beijing"
}
```

#### curl response

```bash
curl -vsk http://localhost:3000/mock/hack/user1_302.json
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 3000 (#0)
> GET /mock/hack/user1_302.json HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.50.3
> Accept: */*
>
< HTTP/1.1 302 OK
< Access-Control-Allow-Origin: *
< Content-Type: application/json
< x-iac-token: robert_iac
< token: QiagNT12rRz7y9
< location: http://localhost:8899
< Content-Length: 68
< Date: Sun, 05 Jan 2020 05:37:33 GMT
< Connection: keep-alive
<
{
    "name": "wuyang",
    "age": 27,
    "addr": "beijing"
}
```

## TODO

- support .http protocol which takes whole file as a api, containing http code, header and body (done)
- support custom project virtual path in final api url (done)
- support a good ui result(current mock index only useable if your chrome uses a plugin like JSON Viewer then you could click the mock url directly)
- add UI to save mock api path, header and body. Persist to server disk file.
<!-- - add option for different file path delimiter when support httpCode by filename. i.e,"\_","." etc -->
- support user defined delimiter to get httpCode from filename, i.e, dot instead of underline
- support hide folder type link
- support only show top level link in index root and hide child level link in other routes
