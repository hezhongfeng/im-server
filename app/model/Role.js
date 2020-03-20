module.exports = app => {
  const { STRING } = app.Sequelize;

  const Role = app.model.define('role', {
    name: {
      type: STRING,
      unique: 'name'
    },
    keyName: {
      type: STRING,
      unique: 'key_name'
    },
    desc: {
      type: STRING
    }
  });

  Role.associate = function() {
    // Many-To-Many associations
    app.model.Role.belongsToMany(app.model.Right, { through: 'role_right' });
    app.model.Role.belongsToMany(app.model.User, { through: 'user_role' });
  };

  return Role;
};
