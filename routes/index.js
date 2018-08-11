var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const expressValidator = require('express-validator');
const passport = require('passport');
const saltRounds = 10;
let user_id = {};
/* GET home page. */



router.get('/logout', (req, res, next) => {
    req.logout()
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/');
    })
});


router.get('/', (req, res, next) => {
  res.render('home');
});

router.post('/login', passport.authenticate('local',{
	successRedirect:'/user/dashboard',
	failureRedirect:'/login'
}));

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
	const db = require('../db.js');
	req.checkBody('username', 'Username field cannot be empty.').notEmpty();
	req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
	req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	req.checkBody('repassword', 'Password must be between 8-100 characters long.').len(8, 100);
	req.checkBody('repassword', 'Passwords do not match, please try again.').equals(req.body.password);

	const validationErrors = req.validationErrors(); 
		const username = req.body.username;
		const email = req.body.email;
		let password = req.body.password;
	if(validationErrors){
		console.log(`validationErrors: ${JSON.stringify(validationErrors)}`);
		res.render('register', {validationErrors:validationErrors});
	} else {
			bcrypt.hash(password, saltRounds, function(err, hash) {
	  		if(err) throw err;
	  		else{
				db.query('INSERT INTO users (name,password,email) VALUES(?,?,?)' ,[username,hash,email], 
				(error,results,fields)=>{
					if(error) throw error;
					else {
						db.query('SELECT LAST_INSERT_ID() AS user_id', (error,results,fields) => {
							if(error) throw error;
							else{
								console.log(results[0]);
								user_id = results[0];
							req.login(user_id, function(err) {
								  if (err) { return next(err); }
								  return res.redirect('/user/dashboard');
								});
							}
						});

					}
				});  		
			}
		});

	}
});
passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});
 
passport.deserializeUser(function(id, done) {
    done(null, user_id);
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}


router.post('/validate', (req, res, next) => {
	const db = require('../db.js');
	
	db.query('SELECT name from users where name=?',[req.body.username],(error,results,fields) => {
		if(error) throw error;
		console.log(req.body.username);
		console.log(results[0]);
		if(!results[0]){    // NO USER FOUND WITH ENTERED NAME
			res.send(true); // RETURN TRUE
		} else {
			res.send(false);
		}
	});
	
	
});

module.exports = router;
