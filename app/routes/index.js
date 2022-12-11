const authRouter = require("../components/auth/authRouter");
const userRouter = require("../components/users/userRouter");
const workplaceRouter = require("../components/workplaces/workplaceRouter");
const roleRouter = require("../components/roles/roleRouter");
const groupRouter = require("../components/groups/groupRouter");
const presentationRouter = require("../components/presentations/presentationRouter");
const slideRouter = require("../components/slides/slideRouter");
const authMiddleware = require("../components/auth/authMiddleware");

function route(app) {
  app.use("/users", authMiddleware.verifyToken, userRouter);
  app.use("/auth", authRouter);
  app.use("/workplaces", workplaceRouter);
  app.use("/roles", roleRouter);
  app.use("/groups", authMiddleware.verifyToken, groupRouter);
  app.use("/presentations", authMiddleware.verifyToken, presentationRouter);
  app.use("/slides", authMiddleware.verifyToken, slideRouter);

  app.use("/", authMiddleware.verifyToken, (req, res, next) => {
    res.status(200).json(req.user);
  });
}

module.exports = route;
