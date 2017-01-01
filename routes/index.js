var express = require('express');
var router = express.Router();
var passport = require('passport'), TwitterStrategy = require('passport-twitter').Strategy;


var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: '',
    consumerSecret: '',
	access_token_key: '',
	access_token_secret: '',
    callback: 'http://localhost:3000/twitterSignup',
    timeout_ms: 60*1000,
});



var _requestSecret;
function getRequestToken (req,res,next){ //middleware, calls next()  middleware, usually a route  if successful
	twitter.getRequestToken(function(err, requestToken, requestSecret) {
		if (err)
			res.status(500).send(err);
		else {
			_requestSecret = requestSecret;
			next();
		}
	});
}


/* GET home page. */
router.get('/', function(req, res, next) {
	// twitter.post('statuses/update', {status: 'testing'},  function(error, tweet, response){
	//   if(error){
	//     console.log(error);
	//   }
	//   console.log(tweet);  // Tweet body.
	//   console.log(response);  // Raw response object.
	//   res.send(twee;t.toString() + "\n" + response);
	//    //res.render('index', { title: 'Express' });
	// });
	// twitter.get('search/tweets', { q: 'programming', count: 1 }, function(err, data, response) {
	//   res.send(data);
	// });


	res.render('index', { title: 'Express' });

});

router.get('/oauth/twitter',passport.authenticate('twitter')); //authenticate user then redirects

router.get('/twitterSignup',getRequestToken,function(req,res,next){
	try{
        var requestToken = req.query.oauth_token, //is appended to the callback url
            verifier = req.query.oauth_verifier;
        twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
            if (err)
                res.status(500).send(err);
            //else
            else
            	twitter.verifyCredentials(accessToken, accessSecret, { include_email: true},function(err, user) { //this doesnt get the email
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(user);
                });
        });
    } catch(err){
        console.log(err);
        res.redirect('/');
    }
})


// twitter.get('search/tweets', { q: 'programming', count: 100 }, function(err, data, response) {
//   console.log(data);
// })

// twitter.stream('statuses/filter', {track: '#programming'}, function(stream) {
//   stream.on('data', function(tweet) {
//     console.log(tweet.text);
//   });

//   stream.on('error', function(error) {
//     console.log(error);
//   });
// });





module.exports = router; //allows routes to be used elsewhere, router object only
