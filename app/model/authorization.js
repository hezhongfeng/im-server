module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Authorization = app.model.define('authorization', {
    provider: { type: STRING },
    uid: { type: STRING },
    username: { type: STRING, unique: true },
    password: { type: STRING },
  });

  Authorization.validPassword = async function(username, password) {
    return await this.findOne({
      where: { password, password },
    });
  };

  return Authorization;
};
