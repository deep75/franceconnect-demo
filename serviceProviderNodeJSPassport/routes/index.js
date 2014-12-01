var express = require('express');
var passport = require('passport');
var router = express.Router();
var request = require('request');
var config = (new (require('../helpers/configManager.js'))())._rawConfig;

router.get('/login_org', passport.authenticate('openidconnect'), function (req, res) {
});

router.get('/', function (req, res) {
    res.render('index', {title: 'Express', user: req.session.user});
});


router.get('/oidc_callback', function(req, res, next) {
    passport.authenticate('openidconnect', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var errorName = res.req.query.error;
            var errorDescription = res.req.query.error_description;
            return res.send({error: {'name': errorName, 'message': errorDescription}});
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect(302, '/demarche/etape1');
        });
    })(req, res, next);
});


router.get('/demarche/etape1', function (req, res) {
    if (req.session.passport.user != null) {
        // pas de sessions utilisateur -> on redirige vers la page d'accueil
        //res.redirect(302, '/');
        req.session.user = req.session.passport.user.displayName;
    }
    res.render('demarche-etape1', {title: 'Démarche', user: req.session.user});
});

router.get('/get-data', function (req, res) {
    res.redirect(302, config.oauthProviderURL + '?client_id=123&scope=data&redirect_uri=' + config.oauth2AllowCallbackURL);
});

router.get('/oauth2/allow', function (req, res) {
    res.render('oauth2-allow');
});

router.get('/oauth2/deny', function (req, res) {
    res.render('oauth2-deny');
});

router.get('/logout', function (req, res) {
    console.log(config);
    console.log(config.logoutUrl);
    if (req.session && req.session.passport.user) {
        request.post({
            url: config.logoutUrl,
            json: {sub: req.session.passport.user.id}
        }, function (error) {
            if (error) {
                console.error('An error occurred', error);
                res.redirect('/');
            } else {
                req.session.destroy(function () {
                    res.redirect(302, '/');
                });
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
