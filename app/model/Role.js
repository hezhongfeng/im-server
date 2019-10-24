module.exports = app => {
  const { STRING } = app.Sequelize;

  const Role = app.model.define('role', {
    name: {
      type: STRING
    },
    photo: {
      type: STRING
    }
  });

  return Role;
};
