'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var _ = require('lodash');

var request_yelp = function(set_parameters,callback) {
  var httpMethod = 'GET';
  var url = 'http://api.yelp.com/v2/search';
  var required_parameters = {
    oauth_consumer_key : process.env.CONSUMER_KEY,
    oauth_token : process.env.TOKEN,
    oauth_nonce : n(),
    oauth_timestamp : new Date().getTime(),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };

	var default_parameters = {
	 location: 'San+Francisco',
	 terms: 'nightlife'
 	};

  var parameters = _.assign(default_parameters,set_parameters, required_parameters);
  var consumerSecret = process.env.CONSUMER_SECRET;
  var tokenSecret = process.env.TOKEN_SECRET;
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});
  parameters.oauth_signature = signature;
  var paramURL = qs.stringify(parameters);
  var apiURL = url+'?'+paramURL;

  request(apiURL, function(error, response, body){
    return callback(error,response,body);
  });

};
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	// app.route('/api/:id')
	// 	.get(isLoggedIn, function (req, res) {
	// 		res.json(req.user.github);
	// 	});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/yelp')
		.get(function(req,res){
			request_yelp({},function(error,response,body){
				res.json(body);
			})
		});

	// app.route('/api/:id/clicks')
	// 	.get(isLoggedIn, clickHandler.getClicks)
	// 	.post(isLoggedIn, clickHandler.addClick)
	// 	.delete(isLoggedIn, clickHandler.resetClicks);
};
