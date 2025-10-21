/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/v1/scraping-batch/route";
exports.ids = ["app/api/v1/scraping-batch/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fscraping-batch%2Froute&page=%2Fapi%2Fv1%2Fscraping-batch%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fscraping-batch%2Froute.ts&appDir=C%3A%5CUsers%5Cdilan%5CDocuments%5CGitHub%5CWeb-Scrapping-Frontend2%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cdilan%5CDocuments%5CGitHub%5CWeb-Scrapping-Frontend2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fscraping-batch%2Froute&page=%2Fapi%2Fv1%2Fscraping-batch%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fscraping-batch%2Froute.ts&appDir=C%3A%5CUsers%5Cdilan%5CDocuments%5CGitHub%5CWeb-Scrapping-Frontend2%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cdilan%5CDocuments%5CGitHub%5CWeb-Scrapping-Frontend2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_dilan_Documents_GitHub_Web_Scrapping_Frontend2_src_app_api_v1_scraping_batch_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/v1/scraping-batch/route.ts */ \"(rsc)/./src/app/api/v1/scraping-batch/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/v1/scraping-batch/route\",\n        pathname: \"/api/v1/scraping-batch\",\n        filename: \"route\",\n        bundlePath: \"app/api/v1/scraping-batch/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\dilan\\\\Documents\\\\GitHub\\\\Web-Scrapping-Frontend2\\\\src\\\\app\\\\api\\\\v1\\\\scraping-batch\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_dilan_Documents_GitHub_Web_Scrapping_Frontend2_src_app_api_v1_scraping_batch_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ2MSUyRnNjcmFwaW5nLWJhdGNoJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ2MSUyRnNjcmFwaW5nLWJhdGNoJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdjElMkZzY3JhcGluZy1iYXRjaCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNkaWxhbiU1Q0RvY3VtZW50cyU1Q0dpdEh1YiU1Q1dlYi1TY3JhcHBpbmctRnJvbnRlbmQyJTVDc3JjJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNkaWxhbiU1Q0RvY3VtZW50cyU1Q0dpdEh1YiU1Q1dlYi1TY3JhcHBpbmctRnJvbnRlbmQyJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN5RDtBQUN0STtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcZGlsYW5cXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxXZWItU2NyYXBwaW5nLUZyb250ZW5kMlxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFx2MVxcXFxzY3JhcGluZy1iYXRjaFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdjEvc2NyYXBpbmctYmF0Y2gvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS92MS9zY3JhcGluZy1iYXRjaFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvdjEvc2NyYXBpbmctYmF0Y2gvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxkaWxhblxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXFdlYi1TY3JhcHBpbmctRnJvbnRlbmQyXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXHYxXFxcXHNjcmFwaW5nLWJhdGNoXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fscraping-batch%2Froute&page=%2Fapi%2Fv1%2Fscraping-batch%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fscraping-batch%2Froute.ts&appDir=C%3A%5CUsers%5Cdilan%5CDocuments%5CGitHub%5CWeb-Scrapping-Frontend2%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cdilan%5CDocuments%5CGitHub%5CWeb-Scrapping-Frontend2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/v1/scraping-batch/route.ts":
/*!************************************************!*\
  !*** ./src/app/api/v1/scraping-batch/route.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function POST(request) {\n    try {\n        // Get the form data from the request\n        const formData = await request.formData();\n        // Forward the request to the backend\n        // Backend is running on port 3000 (Docker container scraper_api:3000:3000)\n        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';\n        const response = await fetch(`${backendUrl}/api/v1/scraping-batch`, {\n            method: 'POST',\n            body: formData\n        });\n        if (!response.ok) {\n            const errorData = await response.text();\n            console.error('Backend error:', response.status, errorData);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Backend processing failed'\n            }, {\n                status: response.status\n            });\n        }\n        const data = await response.json();\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data);\n    } catch (error) {\n        console.error('Scraping batch proxy error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to connect to backend'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS92MS9zY3JhcGluZy1iYXRjaC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUF1RDtBQUVoRCxlQUFlQyxLQUFLQyxPQUFvQjtJQUM3QyxJQUFJO1FBQ0YscUNBQXFDO1FBQ3JDLE1BQU1DLFdBQVcsTUFBTUQsUUFBUUMsUUFBUTtRQUV2QyxxQ0FBcUM7UUFDckMsMkVBQTJFO1FBQzNFLE1BQU1DLGFBQWFDLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVyxJQUFJO1FBQzlDLE1BQU1DLFdBQVcsTUFBTUMsTUFBTSxHQUFHTCxXQUFXLHNCQUFzQixDQUFDLEVBQUU7WUFDbEVNLFFBQVE7WUFDUkMsTUFBTVI7UUFDUjtRQUVBLElBQUksQ0FBQ0ssU0FBU0ksRUFBRSxFQUFFO1lBQ2hCLE1BQU1DLFlBQVksTUFBTUwsU0FBU00sSUFBSTtZQUNyQ0MsUUFBUUMsS0FBSyxDQUFDLGtCQUFrQlIsU0FBU1MsTUFBTSxFQUFFSjtZQUNqRCxPQUFPYixxREFBWUEsQ0FBQ2tCLElBQUksQ0FDdEI7Z0JBQUVGLE9BQU87WUFBNEIsR0FDckM7Z0JBQUVDLFFBQVFULFNBQVNTLE1BQU07WUFBQztRQUU5QjtRQUVBLE1BQU1FLE9BQU8sTUFBTVgsU0FBU1UsSUFBSTtRQUNoQyxPQUFPbEIscURBQVlBLENBQUNrQixJQUFJLENBQUNDO0lBQzNCLEVBQUUsT0FBT0gsT0FBTztRQUNkRCxRQUFRQyxLQUFLLENBQUMsK0JBQStCQTtRQUM3QyxPQUFPaEIscURBQVlBLENBQUNrQixJQUFJLENBQ3RCO1lBQUVGLE9BQU87UUFBK0IsR0FDeEM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcZGlsYW5cXERvY3VtZW50c1xcR2l0SHViXFxXZWItU2NyYXBwaW5nLUZyb250ZW5kMlxcc3JjXFxhcHBcXGFwaVxcdjFcXHNjcmFwaW5nLWJhdGNoXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBHZXQgdGhlIGZvcm0gZGF0YSBmcm9tIHRoZSByZXF1ZXN0XHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IGF3YWl0IHJlcXVlc3QuZm9ybURhdGEoKVxyXG4gICAgXHJcbiAgICAvLyBGb3J3YXJkIHRoZSByZXF1ZXN0IHRvIHRoZSBiYWNrZW5kXHJcbiAgICAvLyBCYWNrZW5kIGlzIHJ1bm5pbmcgb24gcG9ydCAzMDAwIChEb2NrZXIgY29udGFpbmVyIHNjcmFwZXJfYXBpOjMwMDA6MzAwMClcclxuICAgIGNvbnN0IGJhY2tlbmRVcmwgPSBwcm9jZXNzLmVudi5CQUNLRU5EX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDozMDAwJ1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtiYWNrZW5kVXJsfS9hcGkvdjEvc2NyYXBpbmctYmF0Y2hgLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBib2R5OiBmb3JtRGF0YSxcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICBjb25zdCBlcnJvckRhdGEgPSBhd2FpdCByZXNwb25zZS50ZXh0KClcclxuICAgICAgY29uc29sZS5lcnJvcignQmFja2VuZCBlcnJvcjonLCByZXNwb25zZS5zdGF0dXMsIGVycm9yRGF0YSlcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgIHsgZXJyb3I6ICdCYWNrZW5kIHByb2Nlc3NpbmcgZmFpbGVkJyB9LFxyXG4gICAgICAgIHsgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMgfVxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGRhdGEpXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ1NjcmFwaW5nIGJhdGNoIHByb3h5IGVycm9yOicsIGVycm9yKVxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGNvbm5lY3QgdG8gYmFja2VuZCcgfSxcclxuICAgICAgeyBzdGF0dXM6IDUwMCB9XHJcbiAgICApXHJcbiAgfVxyXG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIlBPU1QiLCJyZXF1ZXN0IiwiZm9ybURhdGEiLCJiYWNrZW5kVXJsIiwicHJvY2VzcyIsImVudiIsIkJBQ0tFTkRfVVJMIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJvayIsImVycm9yRGF0YSIsInRleHQiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGF0dXMiLCJqc29uIiwiZGF0YSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/v1/scraping-batch/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fv1%2Fscraping-batch%2Froute&page=%2Fapi%2Fv1%2Fscraping-batch%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fv1%2Fscraping-batch%2Froute.ts&appDir=C%3A%5CUsers%5Cdilan%5CDocuments%5CGitHub%5CWeb-Scrapping-Frontend2%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cdilan%5CDocuments%5CGitHub%5CWeb-Scrapping-Frontend2&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();