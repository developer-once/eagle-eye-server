export default {
  // ------------------ App_key ------------------
  100: () => {
    return {
      code: 100,
      data: "",
      msg: '缺少 app_key',
    }
  },
  101: () => {
    return {
      code: 101,
      data: "",
      msg: 'app_key 不合法',
    }
  },
  102: () => {
    return {
      code: 102,
      data: "",
      msg: '无权限',
    }
  },
  110: () => {
    return {
      code: 110,
      data: "",
      msg: '项目已存在，请修改项目名称后重试',
    }
  },
  200: (data: any) => {
    return {
      code: 200,
      data,
      msg: 'success',
    };
  },
  // ------------------ User ------------------
  300: () => {
    return {
      code: 300,
      data: "",
      msg: '请重新登录',
    }
  },
  301: () => {
    return {
      code: 301,
      data: "",
      msg: '邮箱或密码错误',
    }
  },
  302: () => {
    return {
      code: 302,
      data: "",
      msg: '用户名或邮箱已存在，请修改后重试',
    }
  },
  // ------------------ Server ------------------
  500: (data: any) => {
    return {
      code: 500,
      data: data,
      msg: "服务端错误",
    }
  }
}