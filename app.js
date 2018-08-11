var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var babel = require("babel-core");
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var compression = require('compression');

//Autherntication 
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


require('dotenv').config();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const options = {
//   host: 'sql12.freemysqlhosting.net',
//   user: 'sql12246627',
//   password: 'Knst5sCzVp',
//   database : 'sql12246627',
//   port : process.env.DB_PORT
// };
 
 var options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database : 'ricemill',
  port : 3306
};

 var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'expressnpm',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true } https 
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
function(username, password, done) {

  const db = require('./db.js');
  db.query('SELECT id, password from users where name=?' , [username] ,(err,results,fields) => {
      if(err) throw err;

      if(results.length === 0){
        done(null,false);
      } else {
        const hash = results[0].password;
          bcrypt.compare(password, hash , (err,response) => {
            if(response===true){
              console.log(results[0]);
              return done(null,results[0].id)
            } else {
              done(null,false);
            }
          } 
        );
      }
    })
  }
));

app.use((req,res,next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use(compression());

app.use('/', indexRouter);
app.use('/user', usersRouter);

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

// Handlebars default config
const hbs = require('hbs');
const fs = require('fs');

const partialsDir = __dirname + '/views/partials';

const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});

app.listen(process.env.PORT || 5000, function(){
   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
 });

module.exports = app;
