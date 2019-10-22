module.exports = app => {
  const { STRING } = app.Sequelize;

  const Authorization = app.model.define('authorization', {
    provider: { type: STRING },
    uid: { type: STRING },
    username: { type: STRING, unique: true },
    password: { type: STRING }
  });

  // One-To-One associations
  Authorization.associate = function() {
    app.model.Authorization.hasOne(app.model.User);
  };

  return Authorization;
};
