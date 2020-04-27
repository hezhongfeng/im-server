module.exports = app => {
  const { STRING, BOOLEAN, INTEGER } = app.Sequelize;

  const Apply = app.model.define('apply', {
    type: {
      type: STRING
    },
    fromId: {
      type: INTEGER
    },
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
