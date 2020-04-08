module.exports = (app) => {
  const { STRING, BOOLEAN } = app.Sequelize;

  const Group = app.model.define('group', {
    name: {
      type: STRING,
      unique: 'name',
    },
    photo: {
      type: STRING,
    },
    introduction: {
      type: STRING,
    },
    disabled: {
      type: BOOLEAN,
    },
  });

  Group.associate = function () {
    // One-To-One associations
    app.model.Group.belongsTo(app.model.Conversation);

    // Many-To-Many associations
    app.model.Group.belongsToMany(app.model.User, { through: 'user_group' });
  };

  return Group;
};
