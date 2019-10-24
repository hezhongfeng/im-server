module.exports = app => {
  const { STRING } = app.Sequelize;

  const Right = app.model.define('right', {
    nickname: {
      type: STRING
    },
    keyName: {
      type: STRING
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
