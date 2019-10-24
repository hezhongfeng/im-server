module.exports = app => {
  const { STRING } = app.Sequelize;

  const Right = app.model.define('right', {
    nickname: {
      type: STRING
    },
    photo: {
      type: STRING
    }
  });

  return Right;
};
