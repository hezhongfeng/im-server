const LocalStrategy = require('passport-local').Strategy;

module.exports = app => {
  // const config = app.config.passportLocal;
  // config.passReqToCallback = true;
  app.passport.use(
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        const user = {
          provider: 'local',
          username,
          password,
        };
        app.passport.doVerify(req, user, done);
      }
    )
  );
};
