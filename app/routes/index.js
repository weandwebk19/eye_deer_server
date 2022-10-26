const authRouter = require('../api/auth/authRouter');
const userRouter = require('../api/users/userRouter');
const workplaceRouter = require('../api/workplaces/workplaceRouter');

function route(app) {
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
  app.use('/workplace', workplaceRouter);

  app.use('/', (req, res) => {
    res.send('response with resource');
  })
}

module.exports = route;
