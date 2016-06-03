var express = require('express'), passport = require('passport');

var router = express.Router();

/********************************************************************/

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){ 
      return next(); 
  }
  res.redirect('/login');
}
    
/********************************************************************/

/* GET home page. */
router.get('/', function(req, res){
  res.render('index.html', { user: req.user });
});

router.get('/account', ensureAuthenticated, function(req, res){
  res.render('account.html', { user: req.user });
});

router.get('/login', function(req, res){
  res.render('login.html', { user: req.user });
});

router.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true}),
  function(req, res){
// The request will be redirected to spotify for authentication, so this
// function will not be called.
});

router.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;