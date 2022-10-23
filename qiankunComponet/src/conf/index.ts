export const Limitp = {
  sy: '1', //系统租户
  bs: '2', //基础数据账户
  ro: '3', //角色
  or: '41', //机构
  de: '42', //部门
  st: '43', //人员
  ws: '44', //工作站
  pt: '51', //个人类型
  pe: '52', //个人
};

// 右键菜单类型
export const CONTEXT_MENU_TYPES = new Proxy(
  {
    FAVORITE: {
      key: Symbol('个嘱收藏'),
      sn: 4,
    },
    SUBSCRIBE: {
      key: Symbol('重新预约'),
      sn: 4,
    },
  },
  {
    get(target: any, p) {
      const obj = target[p];
      if (!obj) return {};
      return { ...obj, na: obj.key.description };
    },
  },
);
