'use strict;'

var IndexController = function(){};

IndexController.prototype.handleMain = function(req, res){
    if(req.session.user){
        res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user});
    } else {
        if(req.session.passport && req.session.passport.user){
            var given_name = (req.session.passport.user._json.given_name) ? req.session.passport.user._json.given_name : '';
            var family_name = (req.session.passport.user._json.family_name) ? req.session.passport.user._json.family_name : '';
            req.session.user = given_name + ' ' + family_name;
            res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: req.session.user});
        } else {
            res.render('index', {title: 'Démonstrateur France Connect - Accueil', user: undefined});
        }
    }
};


module.exports.IndexController = IndexController;