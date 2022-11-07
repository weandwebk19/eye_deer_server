const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const route = require('./app/routes');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const session = require('express-session');
const db = require('./app/models');
const exec = require('child_process').exec;
const cors = require('cors');
const rediscl = require('./app/redis');

const app = express();
dotenv.config({ path: '.env' });

//Connect to db
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
//Sync the database
db.sequelize.sync({ force: true }).then(() => {
  // exec('npx sequelize-cli db:migrate:undo', {cwd: 'app'},
  // function (error, stdout, stderr) {
  //   if (error !== null) {
  //     console.log('exec error: ' + error);
  //   }
  // });

  // exec('npx sequelize-cli db:migrate', {cwd: 'app'},
  // function (error, stdout, stderr) {
  //   if (error !== null) {
  //     console.log('exec error: ' + error);
  //   }
  // });
  
  //Excute seed all tables from seeders folder
  exec('npx sequelize-cli db:seed:all', {cwd: 'app'},
    function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
  });
  console.log("Drop and re-sync DB");
});

//Connect to redis
rediscl.on("connect", function () {
  console.log("Redis plugged in.");
});
rediscl.on('error', (err) => console.log('Redis Client Error', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(
  cors({
      credentials: true,
      origin: process.env.FRONTEND_BASE_URL
  })
);

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));

//Route init
route(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
