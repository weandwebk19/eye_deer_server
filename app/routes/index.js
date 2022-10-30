const authRouter = require('../components/auth/authRouter');
const userRouter = require('../components/users/userRouter');
const workplaceRouter = require('../components/workplaces/workplaceRouter');
const roleRouter = require('../components/roles/roleRouter');
const authMiddleware = require('../components/auth/authMiddleware');

function route(app) {
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
  app.use('/workplace', workplaceRouter);
  app.use('/role', roleRouter);

  app.use('/', authMiddleware.verifyToken, (req, res, next) => {
    res.status(200).json(req.user)
  })
}

module.exports = route;
