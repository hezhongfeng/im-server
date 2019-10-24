module.exports = app => {
  const { STRING } = app.Sequelize;

  const Role = app.model.define('role', {
    name: {
      type: STRING
    },
    keyName: {
      type: STRING
    },
    desc: {
      type: STRING
    }
  });

  Role.associate = function() {
    // Many-To-Many associations
    app.model.Role.belongsToMany(app.model.Right, { through: 'role_right' });
  };

  return Role;
};
