module.exports = app => {
  const { STRING } = app.Sequelize;

  const User = app.model.define('user', {
    provider: {
      type: STRING
    },
    username: {
      type: STRING,
      unique: 'username'
    },
    password: {
      type: STRING
    }
  });

  User.associate = function() {
    // One-To-One associations
    app.model.User.hasOne(app.model.UserInfo);

    // One-To-Many associations
    app.model.User.hasMany(app.model.Apply);

    // Many-To-Many associations
    app.model.User.belongsToMany(app.model.Group, { through: 'user_group' });
    app.model.User.belongsToMany(app.model.Role, { through: 'user_role' });
  };

  return User;
};
