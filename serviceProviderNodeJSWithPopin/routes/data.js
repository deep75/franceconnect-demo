var express = require('express');
var passport = require('passport');
var router = express.Router();
var request = require('request');
var config = (new (require('../helpers/configManager.js'))())._rawConfig;
var Oauth2Strategy = require('passport-oauth').OAuth2Strategy;


passport.use('provider', new Oauth2Strategy({
        authorizationURL: config.oauth.authorizationURL,
        tokenURL: config.oauth.tokenURL,
        clientID: config.openIdConnectStrategyParameters.clientID,
        clientSecret: config.openIdConnectStrategyParameters.clientSecret,
        callbackURL: config.oauth.callbackURL,
        scope:config.oauth.scopes
    },
    function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        console.log(profile);
        done(null, profile);
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

//1st step
/*router.get('/', function (req, res, next) {
    req.session.user = req.session.passport.user;
    next();
}, passport.authenticate('provider'), function (req, res, next) {
    console.log('got through the oauth2 authentication process.');
});*/

//2nd step
router.get('/callback', passport.authenticate('provider', {
    successRedirect: '/data/authOk',
    failureRedirect: '/data/authKo',
    scope: config.oauth.scopes
}), function (req, res, next) {
    console.log('got to the callback URL, at this point we should ve obtained an access token');
});

var request = require('request');
router.get('/authOk', function (req, res, next) {
    var options = {
        url: config.quotientFamilialURL,
        headers: {
            'Authorization': 'Bearer ' + req.session.passport.user.accessToken
        }
    };
    request.get(options, function (err, response, body) {
        if (err) {
            console.error('Error while reaching FD');
            console.error(err);
            next(err);
        } else if (!body) {
            console.log('No body ... ');
            next(new Error('No Body'));
        }
        else if (response.statusCode != 200) {
            if (response.headers['www-authenticate']) {
                var error = new Error();
                var errorElements = response.headers['www-authenticate'].trim().match('Bearer: error="(.*?)",error_description="(.*?)"');
                if (errorElements.length == 3) {
                    error.name = errorElements[1];
                    error.message = errorElements[2];
                }
                else {
                    error.message = "Wrongly formatted authentication header";
                }
                console.error(error);
                next(error);
            } else {
                var error = new Error();
                error.name = 'errorTriggeredButNoDescriptionProvided';
                error.message = 'An error occurred but no error description was provided to the client';
                console.error(error);
                console.error(response.statusCode);
                console.error(response.body);
                next(error);
            }
        }
        else {
            req.session.passport.user.quotientFamilial = JSON.parse(body);
            res.redirect('/data/done');
        }
    });
});
router.get('/authKo', function (req, res, next) {
    res.redirect('/demarche/etape1');
});

router.get('/done', function (req, res, next) {
    res.render('demarche-etape2.ejs', {user: req.session.user.displayName, data: req.session.passport.user.quotientFamilial});
});


module.exports = router;
