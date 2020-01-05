### mock server advantages

[x] register all api base on file path and name
[x] support http header content-type by file name extension and default content-type, i.e, "users.json" or "alter.xml"
[x] support file content mapping as api response body
[ ] support response body warp base on file content
[ ] support custom project virtual path in final api url
[x] support http code by file name like "gotoKC_302.json"
[x] support user specific http header by file name like "gotoKc_302.header" , also inherit from "project.header" as project scope http headers
[x] support custom mock api prefix by mockApiPrefix
[x] support custom file scan filter by mockFileFilter
[x] support custom path scan by localMockPath
[x] support control of inherit from project header file by mergeFolderHeader

### start

npm install

nodemon app.js

### test apis

bash testAllApis.sh

#### read user defined env variables mockFileFilter, localMockPath, mockApiPrefix to define which folder and files to scan and map to apis

"mockApiPrefix": "/mock", // mock api prefix will show up in final url as prefix
"mockFileFilter": "\*.json", // file filter, i.e, `*, *.json, *.xml`
"localMockPath": "api", // local scan path

local file : mapped api url
"/api/hack/user1_302.json": "/mock/hack/user1_302.json"

result:
http://localhost:3000/mock/hack/user1_302.json

### record file path and the final api url in user specified routerMapFilename

i.e,
"routerMapFilename": "./routerMap.json",

### set http header Content-Type by file extension or the defaultContentType

i.e,
"/api/hack/user1_302.json", get "Content-Type: application/json"

### set final api url with mockApiPrefix and the full file name, including the file extension

"mockApiPrefix": "/mock", // mock api prefix will show up in final url as prefix

local file : mapped api url
"/api/hack/user1_302.json": "/mock/hack/user1_302.json"

result:
http://localhost:3000/mock/hack/user1_302.json

### set api http header by api file base name related ".header", also inherit from "project.header" file

i.e,
user1_302.json
user1_302.header

#### header content

```
1140 $ cat user1_302.header
{
    "token":"QiagNT12rRz7y9",
    "location":"http://localhost:8899"
}
```

```
1143 $ cat project.header
{
    "x-iac-token": "robert_iac"
}
```

#### body content

```
1141 $ cat user1_302.json
{
    "name": "wuyang",
    "age": 27,
    "addr": "beijing"
}
```

#### curl response

```
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
