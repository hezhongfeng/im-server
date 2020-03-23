module.exports = app => {
  const { STRING } = app.Sequelize;

  const Right = app.model.define('right', {
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

  Right.associate = function() {
    // Many-To-Many associations
    app.model.Right.belongsToMany(app.model.Role, { through: 'role_right' });
  };

  return Right;
};
