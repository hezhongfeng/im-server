module.exports = app => {
  const { STRING, BOOLEAN, INTEGER } = app.Sequelize;

  const Group = app.model.define('group', {
    name: {
      type: STRING,
      unique: 'name'
    },
    photo: {
      type: STRING,
      defaultValue: '/public/images/group.png'
    },
    introduction: {
      type: STRING
    },
    // 是否解散
    disabled: {
      type: BOOLEAN,
      defaultValue: false
    },
    // 是否禁言
    mute: {
      type: BOOLEAN,
      defaultValue: false
    },
    ownerId: {
      type: INTEGER,
      allowNull: false
    }
  });

  Group.associate = function () {
    // One-To-One associations
    app.model.Group.belongsTo(app.model.Conversation);

    // Many-To-Many associations
    app.model.Group.belongsToMany(app.model.User, { through: 'user_group' });
  };

  return Group;
};
