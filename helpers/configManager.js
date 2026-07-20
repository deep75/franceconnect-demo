'use strict';
var cloneDeep = require('lodash/cloneDeep');
var config = require('../config/config.json');

function readEnv(name, fallback) {
    return process.env[name] || fallback;
}

function readEnvArray(name, fallback) {
    if (!process.env[name]) {
        return fallback;
    }

    return process.env[name].split(',').map(function(value) {
        return value.trim();
    }).filter(function(value) {
        return value.length > 0;
    });
}

var Configuration = function(){
    var rawConfig = cloneDeep(config);
    var oidc = rawConfig.openIdConnectStrategyParameters;
    var oauth = rawConfig.oauth;

    rawConfig.env = readEnv('APP_ENV', rawConfig.env);
    rawConfig.fcURL = readEnv('FC_URL', rawConfig.fcURL);
    rawConfig.quotientFamilialURL = readEnv('FC_QUOTIENT_FAMILIAL_URL', rawConfig.quotientFamilialURL);
    rawConfig.session.secret = readEnv('SESSION_SECRET', rawConfig.session.secret);

    oidc.clientID = readEnv('FC_CLIENT_ID', oidc.clientID);
    oidc.clientSecret = readEnv('FC_CLIENT_SECRET', oidc.clientSecret);
    oidc.callbackURL = readEnv('FC_CALLBACK_URL', oidc.callbackURL);
    oidc.authorizationURL = readEnv('FC_AUTHORIZATION_URL', oidc.authorizationURL);
    oidc.tokenURL = readEnv('FC_TOKEN_URL', oidc.tokenURL);
    oidc.userInfoURL = readEnv('FC_USERINFO_URL', oidc.userInfoURL);
    oidc.logoutURL = readEnv('FC_LOGOUT_URL', oidc.logoutURL);
    oidc.acr_values = readEnv('FC_ACR_VALUES', oidc.acr_values);
    oidc.scope = readEnvArray('FC_SCOPE', oidc.scope);

    oauth.authorizationURL = readEnv('FC_DATA_AUTHORIZATION_URL', oauth.authorizationURL);
    oauth.tokenURL = readEnv('FC_DATA_TOKEN_URL', oauth.tokenURL);
    oauth.callbackURL = readEnv('FC_DATA_CALLBACK_URL', oauth.callbackURL);
    oauth.scopes = readEnvArray('FC_DATA_SCOPES', oauth.scopes);

    this._rawConfig = rawConfig;
};

Configuration.prototype.getMongoPort = function(){
    return this._rawConfig.mongo.port;
};

Configuration.prototype.getMongoHost = function(){
    return this._rawConfig.mongo.host;
};

module.exports = Configuration;