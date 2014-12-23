var express = require('express');
var passport = require('passport');
var router = express.Router();
var config = (new (require('../helpers/configManager.js'))())._rawConfig;
var url = require('url');

router.get('/', function (req, res) {
    res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user});
});

router.get('/login_org', passport.authenticate('openidconnect'), function (req, res) {
});

router.get('/oidc_callback', function (req, res, next) {
    passport.authenticate('openidconnect', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            var errorName = res.req.query.error;
            var errorDescription = res.req.query.error_description;
            return res.send({error: {'name': errorName, 'message': errorDescription}});
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect(302, '/blank');
        });
    })(req, res, next);
});

router.get('/demarche/etape1', function (req, res) {
    if (req.session.passport.user != null) {
        req.session.user = req.session.passport.user.displayName;
        res.render('demarche-etape1', {title: 'Démarche', user: req.session.user});
    } else {
        res.redirect(302, '/');
    }
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
    req.session.destroy();
    var parsedUrl = url.parse(config.oauth.authorizationURL);
    var logoutUrl = parsedUrl.protocol +'//'+ parsedUrl.host + '/logout';
    res.redirect(logoutUrl);
});

router.get('/blank', function (req, res) {
    res.render('wait_screen');
});

module.exports = router;
