module.exports = app => {
  const { STRING, BOOLEAN, INTEGER, ENUM } = app.Sequelize;

  const Apply = app.model.define('apply', {
    /**
     * 申请的类型：
     * user: 好友申请
     * group: 入群申请
     */
    type: {
      type: ENUM,
      values: ['user', 'group']
    },
    fromId: {
      type: INTEGER
    },
    // 申请的目标ID，可能为用户ID或者是群组ID
    toId: {
      type: INTEGER
    },
    hasHandled: {
      type: BOOLEAN,
      defaultValue: false
    }
  });

  return Apply;
};
