module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const Friend = app.model.define('friend', {
    userId: {
      type: INTEGER
    },
    friendId: {
      type: INTEGER
    }
  });

  Friend.associate = function() {
    // One-To-One associations
    app.model.Friend.belongsTo(app.model.Conversation);
  };

  return Friend;
};
