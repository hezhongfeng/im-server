module.exports = app => {
  const { STRING, BOOLEAN } = app.Sequelize;

  const Group = app.model.define(
    'group',
    {
      name: {
        type: STRING
      },
      photo: {
        type: STRING
      },
      disabled: {
        type: BOOLEAN
      }
    },
    {
      indexes: [
        { unique: true, fields: ['name'] }
      ]
    }
  );

  Group.associate = function() {
    // Many-To-Many associations
    app.model.Group.belongsToMany(app.model.User, { through: 'user_group' });
  };

  return Group;
};
