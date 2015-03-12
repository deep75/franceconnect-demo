'use strict';
var sinon = require('sinon');
var assert = require('chai').assert;
var jwt = require('jwt-simple');
var PassportAuthWithCustomClaims = require('../../helpers/passportAuthenticateWithCustomClaims.js').PassportAuthenticateWithCustomClaims;
var url = require('url');
var CustomStrategyHelper = require('../../helpers/customStrategyHelper.js').CustomStrategyHelper;

var passportAuthWithCustomClaims = null;

beforeEach(function () {
    passportAuthWithCustomClaims = new PassportAuthWithCustomClaims();
});
describe('Authentication parameters', function () {
    var customStrategyHelper = new CustomStrategyHelper();
    describe('generateRequestParameter', function () {
        it('should return a signed JWT token', function () {
            //setup
            var expectedPayload = {
                "claims": {
                    "id_token": {
                        "acr": {"essential": true, values: ["eidas2", "eidas3"]}
                    }
                }
            };
            var secret = 'secret';
            var expected = jwt.encode(expectedPayload, secret);
            //action
            var actual = customStrategyHelper.generateRequestParameter(["eidas2", "eidas3"], 'secret');
            //assert
            assert.equal(actual, expected);
        });

        it('should ensure two JWT tokens are different, provided the secret used is', function () {
            //setup
            var control = customStrategyHelper.generateRequestParameter(["eidas2", "eidas3"], 'secret');
            //action
            var actual = customStrategyHelper.generateRequestParameter(["eidas2", "eidas3"], 'secret2');
            //assert
            assert.notEqual(control, actual);
        });
    });

    describe('prepareAndSendAuthorizationRequest', function () {
        it('should add custom request parameters to the query if acr data (eidas lvl) is set', function () {
            //setup
            var options = {scope: ['openid'], acr:["eidas2", "eidas3"], secret:'secret', authorizationURL:'authorizationURL'};
            var res = {redirect: sinon.spy()};
            //action
            var actual = customStrategyHelper.prepareAuthorizationRequest('redirectURI', options);
            //assert
            assert.deepEqual(actual, 'authorizationURL?response_type=code&client_id=&redirect_uri=redirectURI&scope=openid&request=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGFpbXMiOnsiaWRfdG9rZW4iOnsiYWNyIjp7ImVzc2VudGlhbCI6dHJ1ZSwidmFsdWVzIjpbImVpZGFzMiIsImVpZGFzMyJdfX19fQ.mWqilhdpETa4FtZXJR8VWqbYfPuqayeUP1X4GZCeYvg');
        });

        it('should redirect to an authorization endpoint w/ all the mandatory params', function () {
            //setup
            var options = {scope: ['openid'], secret:'secret', authorizationURL:'authorizationURL', clientID:'clientID'};
            //action
            var actual = customStrategyHelper.prepareAuthorizationRequest('redirectURI', options);
            //assert
            var params = url.parse(actual, true);
            assert.deepEqual(params.query, {
                "response_type": "code",
                "client_id": "clientID",
                "redirect_uri": "redirectURI",
                "scope": "openid"
            });
        });

        describe('optinal parameter handling', function () {
            it('should take the state option into account', function () {
                //setup
                var options = {state:'customState'};
                //action
                var actual = customStrategyHelper.prepareAuthorizationRequest(null, options);
                //assert
                var params = url.parse(actual, true);
                assert.deepEqual(params.query.state, 'customState');
            });

            it('should integrate scopes if they exist', function(){
                //setup
                var options = {scope:['scope1', 'scope2'], scopeSeparator:'%20'};
                //action
                var actual = customStrategyHelper.prepareAuthorizationRequest(null, options);
                //assert
                var params = url.parse(actual, true);
                assert.deepEqual(params.query.scope, 'scope1%20scope2');
            });

            it('should _not_ integrate scopes if no scopes show up in the options', function(){
                //setup
                var options = {scopeSeparator:'%20'};
                //action
                var actual = customStrategyHelper.prepareAuthorizationRequest(null, options);
                //assert
                var params = url.parse(actual, true);
                assert.deepEqual(params.query.scope, undefined);
            });

            it('should add the "consents" query parameter to the authorization call if the option is present', function(){
                //setup
                var options = {consents:1};
                //action
                var actual = customStrategyHelper.prepareAuthorizationRequest(null, options);
                //assert
                var params = url.parse(actual, true);
                assert.deepEqual(params.query.consents, '1');
            });

            it('should _not_ add the "consents" query parameter to the authorization call if the option is not present', function(){
                //setup
                var options = {};
                //action
                var actual = customStrategyHelper.prepareAuthorizationRequest(null, options);
                //assert
                var params = url.parse(actual, true);
                assert.deepEqual(params.query.consents, undefined);
            });

        });

    });
});

