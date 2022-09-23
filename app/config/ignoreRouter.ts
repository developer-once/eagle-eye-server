// -- 声明无需检查 app_key 的路由 --
export const ignoreRouter = [
  "/api/get/project/list",
  "/api/create/project",
  "/api/get/user",

  "/api/create/user",

  // ----- swagger -----
  "/swagger-doc",
  "/swagger-ui.html",
  "/swagger-ui-bundle.js",
  "/swagger-ui-bundle.js.map",
  "/swagger-ui-standalone-preset.js",
  "/swagger-ui-standalone-preset.js.map",
  "/swagger-ui.css",
  "/swagger-ui.css.map",
  "/favicon-32x32.png",
];

// -- 声明无需检查 app_key 权限 --
export const ignoreRouterPermission = [
  "/api/get/project/list",
  "/api/create/project",
  "/api/create/user",
  "/api/get/user",
  // -- 上报 --
  "/api/report",
  "/api/report/crash",
  "/api/get/config",

  // ----- swagger -----
  "/swagger-doc",
  "/swagger-ui.html",
  "/swagger-ui-bundle.js",
  "/swagger-ui-bundle.js.map",
  "/swagger-ui-standalone-preset.js",
  "/swagger-ui-standalone-preset.js.map",
  "/swagger-ui.css",
  "/swagger-ui.css.map",
  "/favicon-32x32.png",
];

// -- 声明需要登录的路由 - 后台查询需要 --
export const checkRouter = [
  "/api/get",
  "/api/get/report",
  "/api/get/page",
  "/api/get/project",
  "/api/get/dashboard/uv",
  "/api/get/dashboard/click",
  "/api/get/report/crash",
  "/api/get/project/list",
];
