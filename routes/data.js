var express = require('express');
var passport = require('passport');
var router = express.Router();
var axios = require('axios');
var config = (new (require('../helpers/configManager.js'))())._rawConfig;
var Oauth2Strategy = require('passport-openidconnect').Strategy;
var passportAuthenticateWithCUstomClaims = require('../helpers/passportAuthenticateWithCustomClaims').PassportAuthenticateWithCustomClaims;

var _ = require('lodash');

var parameters = {
    issuer: config.fcURL,
    authorizationURL: config.oauth.authorizationURL,
    tokenURL: config.oauth.tokenURL,
    clientID: config.openIdConnectStrategyParameters.clientID,
    clientSecret: config.openIdConnectStrategyParameters.clientSecret,
    callbackURL: config.oauth.callbackURL,
    scope: config.oauth.scopes,
    skipUserProfile:true
};

var strat = function() {
    var strategy = new Oauth2Strategy(
        parameters,
        function (iss, sub, profile, accessToken, refreshToken, done) {
            profile = {};
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            done(null, profile);
        });

    var alternateAuthenticate = new passportAuthenticateWithCUstomClaims('', config.openIdConnectStrategyParameters.acr_values, 1);
    strategy.authenticate = alternateAuthenticate.authenticate;
    return strategy;
};

passport.use('provider', strat());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

router.get('/', function (req, res, next) {
    next();
}, passport.authenticate('provider'), function (req, res, next) {
    console.log('got through the oauth2 authentication process.');
});

router.get('/form', function (req, res) {
    if (req.session.passport && req.session.passport.user) {
        req.session.userInfo =  req.session.passport.user.name ? req.session.passport.user : req.session.userInfo;
        if (!req.session.user) {
            req.session.user = req.session.userInfo.name.givenName + " " + req.session.userInfo.name.familyName;
        }
        res.render('demarche-form.ejs', {
            title: 'Démonstrateur France Connect - Inscription à la cantine scolaire',
            user: req.session.user,
            userInfo: req.session.userInfo,
            authUrl: config.oauth.authorizationURL
        });
    } else {
        res.redirect('/');
    }
});

router.post('/form', function (req, res) {
    console.log(req.params);
    req.session.cantineParams = req.body;
    res.redirect('/data/');
});

router.get('/callback', passport.authenticate('provider', {
    successRedirect: '/data/authOk',
    failureRedirect: '/data/authKo',
    scope: config.oauth.scopes
}), function (req, res, next) {
    console.log('got to the callback URL, at this point we should ve obtained an access token');
});

router.get('/authOk', function (req, res, next) {
    if (!req.session.passport || !req.session.passport.user) {
        return res.redirect('/');
    }

    axios.get(config.quotientFamilialURL, {
        headers: {
            'Authorization': 'Bearer ' + req.session.passport.user.accessToken
        },
        validateStatus: function () {
            return true;
        }
    }).then(function(response) {
        if (response.status !== 200) {
            var authenticateHeader = response.headers['www-authenticate'];
            if (authenticateHeader) {
                var handledError = new Error();
                var errorElements = authenticateHeader.trim().match(/Bearer:?\s*error="(.*?)",\s*error_description="(.*?)"/);
                if (errorElements && errorElements.length === 3) {
                    handledError.name = errorElements[1];
                    handledError.message = errorElements[2];
                } else {
                    handledError.message = 'Wrongly formatted authentication header';
                }
                console.error(handledError);
                return next(handledError);
            }

            var missingDescriptionError = new Error();
            missingDescriptionError.name = 'errorTriggeredButNoDescriptionProvided';
            missingDescriptionError.message = 'An error occurred but no error description was provided to the client';
            console.error(missingDescriptionError);
            console.error(response.status);
            console.error(response.data);
            return next(missingDescriptionError);
        }

        if (!response.data) {
            console.log('No body ... ');
            return next(new Error('No Body'));
        }

        var info;
        try {
            info = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        } catch (err) {
            console.error('Error while parsing FD response body');
            return next(err);
        }

        req.session.quotientFamilial = info.quotient;
        req.session.pivotIdentityReturnedByFcToFd = info.pivotIdentity;
        return res.redirect('/blank?urlRedirect=/data/done');
    }).catch(function(err) {
        console.error('Error while reaching FD');
        console.error(err);
        next(err);
    });
});
router.get('/authKo', function (req, res, next) {
    res.redirect(302, '/blank');
});

function userDoesNotHaveSessionDataYet(req) {
    return _.isUndefined(req.session) ||
        _.isUndefined(req.session.user) ||
        _.isUndefined(req.session.passport) ||
        _.isUndefined(req.session.passport.user) ||
        _.isUndefined(req.session.quotientFamilial) ||
        _.isUndefined(req.session.cantineParams);
}
router.get('/done', function (req, res, next) {
    if (userDoesNotHaveSessionDataYet(req)) {
        res.redirect('/');
    } else {
        res.render('demarche-etape2.ejs', {
            title: 'Démonstrateur France Connect - Confirmez votre inscription',
            user: req.session.user,
            data: req.session.quotientFamilial,
            informationsCantine: req.session.cantineParams
        });
    }
});


router.get('/fin-demarche', function (req, res) {
    if (req.session.user) {
        res.render('demarche-fin.ejs', {
            title: 'Démonstrateur France Connect - Confirmation de votre inscription',
            user: req.session.user
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
