var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/dashboard',authenticationMiddleware()  ,(req, res, next) => {
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('dashboard');
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}


module.exports = router;
