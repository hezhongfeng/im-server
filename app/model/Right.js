module.exports = app => {
  const { STRING } = app.Sequelize;

  const Right = app.model.define(
    'right',
    {
      name: {
        type: STRING
      },
      keyName: {
        type: STRING
      },
      desc: {
        type: STRING
      }
    },
    {
      indexes: [
        { unique: true, fields: ['name'] },
        { unique: true, fields: ['key_name'] }
      ]
    }
  );

  Right.associate = function() {
    // Many-To-Many associations
    app.model.Right.belongsToMany(app.model.Role, { through: 'role_right' });
  };

  return Right;
};
