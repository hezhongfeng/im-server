module.exports = app => {
  const { STRING } = app.Sequelize;

  const RoleRight = app.model.define('roleright', {
    name: {
      type: STRING
    },
    photo: {
      type: STRING
    }
  });

  return RoleRight;
};
