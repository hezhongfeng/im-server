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

  return Friend;
};
