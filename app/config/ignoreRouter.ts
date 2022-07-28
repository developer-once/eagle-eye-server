// -- 声明无需检查 app_key 的路由 --
export const ignoreRouter = [
  "/api/get/project/list",
  "/api/create/project",
  "/api/get/user",

  "/api/create/user",
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
