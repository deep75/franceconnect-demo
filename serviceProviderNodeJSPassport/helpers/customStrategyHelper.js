var CustomStrategyHelper = function(){};
var jwt = require('jwt-simple');
var querystring = require('querystring');


CustomStrategyHelper.prototype.generateRequestParameter = function(mandatoryAcrClaims, secret){
    //var token = {"claims"};
    var payload = {
        "claims":{
            "id_token":{"acr":{"essential":true, values:mandatoryAcrClaims}}
        }
    };
    return jwt.encode(payload, secret);
};


CustomStrategyHelper.prototype.prepareAuthorizationRequest = function(callbackURL, options){
    var params = {};
    params['response_type'] = 'code';
    params['client_id'] = options.clientID;
    params['redirect_uri'] = callbackURL;
    var scope = options.scope || this._scope;
    if (Array.isArray(scope)) {
        scope = scope.join(options.scopeSeparator);
    }
    if(scope){
        params.scope = scope;
    }

    // ajout demande des champs facultatifs
    //params.scope = params.scope + this._scopeSeparator + 'email' + this._scopeSeparator + 'address' + this._scopeSeparator + 'phone' + this._scopeSeparator + 'preferred_username';
    // TODO: Add support for automatically generating a random state for verification.
    var state = options.state;
    if (state) {
        params.state = state;
    }
    // TODO: Implement support for standard OpenID Connect params (display, prompt, etc.)

    if (options.consents) {
        params.consents = options.consents;
    }

    //quelque part par là, mettre en place la request avec les paramètres requis
    // ===> veut dire que si FC n'est pas capable de répondre à certaines demandes il devra probablement péter une erreur
    // ===> FC devra décoder le JWT transmis

    if(options.acr){
        params.request = this.generateRequestParameter(options.acr, options.secret);
    }

    return options.authorizationURL + '?' + querystring.stringify(params);
};

module.exports.CustomStrategyHelper = CustomStrategyHelper;