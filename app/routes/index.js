const authRouter = require('../api/auth/authRouter');
const userRouter = require('../api/users/userRouter');

function route(app) {
  app.use('/user', userRouter);
  app.use(authRouter);
  app.use('/', (req, res) => {
    res.send('response with resource');
  })
}

module.exports = route;
