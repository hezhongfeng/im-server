module.exports = app => {
  const { STRING } = app.Sequelize;

  const Right = app.model.define('right', {
    name: {
      type: STRING,
      unique: true
    },
    keyName: {
      type: STRING,
      unique: true
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
