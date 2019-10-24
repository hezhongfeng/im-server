module.exports = app => {
  const { STRING } = app.Sequelize;

  const Group = app.model.define('group', {
    name: {
      type: STRING
    },
    photo: {
      type: STRING
    }
  });

  return Group;
};
