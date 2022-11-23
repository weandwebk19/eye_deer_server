const authRouter = require('../components/auth/authRouter');
const userRouter = require('../components/users/userRouter');
const workplaceRouter = require('../components/workplaces/workplaceRouter');
const roleRouter = require('../components/roles/roleRouter');
const groupRouter = require('../components/groups/groupRouter');
const authMiddleware = require('../components/auth/authMiddleware');

function route(app) {
  app.use('/user', authMiddleware.verifyToken, userRouter);
  app.use('/auth', authRouter);
  app.use('/workplace', workplaceRouter);
  app.use('/role', roleRouter);
  app.use('/group', authMiddleware.verifyToken, groupRouter);

  app.use('/', authMiddleware.verifyToken, (req, res, next) => {
    res.status(200).json(req.user)
  })
}

module.exports = route;
