import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  // ---------- 重定向到swagger-ui.html ----------
  router.redirect('/', '/swagger-ui.html' , 302);

  // ---------- Config ----------
  router.post('/api/get/config', controller.config.geAppConfig);

  // ---------- Report ----------
  router.post('/api/report', controller.report.userSubTableSave);
  router.post('/api/report/crash', controller.report.reportCrash);


  // ---------- Error ----------
  router.get('/api/get/error', controller.error.getError);
  router.get('/api/get/error/crash', controller.error.getReportCrash);


  // ---------- Performance ----------
  // --- 整站 Performance dashboard ---
  router.get('/api/get/dashboard/performance', controller.performance.getDashboard);
  // --- 接口聚合 -- 慢 API && Res ---
  router.get('/api/get/group/performance', controller.performance.getGroupPerformanceAll);
  // --- 接口聚合 -- 慢 API
  router.get('/api/get/group/performance/api', controller.performance.getGroupPerformanceApi);
  // --- 接口聚合 -- 慢 res
  router.get('/api/get/group/performance/res', controller.performance.getGroupPerformanceRes);


  // ---------- Behavior ----------
  router.get('/api/get/page/uv', controller.get.getPageUv);
  router.get('/api/get/dashboard/url', controller.behavior.getClickEventGroupByUrl)


  // ---------- Customize ----------
  router.get('/api/get/customize/report', controller.customize.getCustomizeReportList);


  // ---------- Dashboard ----------
  // --- 整站 PV/UV ---
  router.get('/api/get/dashboard', controller.dashboard.getDashboard);
  // --- 页面聚合 -- PV/UV ---
  router.get('/api/get/group/dashboard', controller.dashboard.getGroupPageDashboard);
  // --- Error ---
  router.get('/api/get/dashboard/error', controller.dashboard.getErrorDashboard)
  // --- Click ---
  router.get('/api/get/dashboard/click', controller.behavior.getClickDashboard);
  
  // --- Performance Res---
  router.get('/api/get/dashboard/performance/res', controller.performance.getPerformanceResDashboard);
  // --- Performance API ---
  router.get('/api/get/dashboard/performance/api', controller.performance.getPerformanceApiDashboard);


  // ---------- USER ----------
  router.post('/api/get/user', controller.user.getUser);
  router.post('/api/create/user', controller.user.createUser);


  // ---------- Project ----------
  router.get('/api/get/project', controller.project.getProject);
  router.get('/api/get/project/list', controller.project.getUserProjectList);
  router.post('/api/create/project', controller.project.create);
  router.post('/api/project/set', controller.project.set);

  // ---------- Chrome plugin ----------
  router.get('/api/plugin/key', controller.plugin.validatePluginKey);
  router.get('/api/get/plugin/key', controller.plugin.getPluginKeyByAppKey);
  router.post('/api/create/plugin/key', controller.plugin.createPluginKey);
};
