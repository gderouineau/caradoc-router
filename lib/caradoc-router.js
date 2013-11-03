var routes = require('../../../config/routes');
var security = require('../../../config/security');
var dir_path = "../../../";

var path = require('path');
var fs = require('fs');



/*
 * CHECK IF SECURITY IS ACTIVE
 */
var secure;
if(security.get.active){
    secure = require('caradoc-security').get;
}
else{
    secure = function(req, res, next){ next();};
}

exports.get = function (app) {

    /*
     * Parcourt des routes principales et secondaires pour pouvoir rédiriger vers l'action d'un controller.
     */
    for( var key in routes.get) {
        var subroutes = require(dir_path+'src/'+routes.get[key]['name']+'/config/routes');
        for(keys in subroutes.get) {
            var controller = require(dir_path+'src/'+routes.get[key]['name']+'/controller/'+subroutes.get[keys]['controller']);
            var firstPattern = '';
            if(routes.get[key]['pattern'] != '/'){
                firstPattern = routes.get[key]['pattern'];
            }
            var secondPattern = subroutes.get[keys]['pattern'];
            var pattern = firstPattern+secondPattern;
            if(subroutes.get[keys]['method'] == 'GET') {
                app.get(pattern, secure , controller.action[subroutes.get[keys]['action']]);
            }
            if(subroutes.get[keys]['method'] == 'POST') {
                app.post(pattern, secure , controller.action[subroutes.get[keys]['action']]);
            }
            if(subroutes.get[keys]['method'] == 'PUT') {
                app.put(pattern, secure ,controller.action[subroutes.get[keys]['action']]);
            }
            if(subroutes.get[keys]['method'] == 'DELETE') {
                app.delete(pattern, secure , controller.action[subroutes.get[keys]['action']]);
            }
        }
    }

    if(fs.existsSync(path.resolve(__dirname,'../../caradoc-login'))){
        var service_login = require('caradoc-login');
        /*
         * LOGOUT
         */
        app.get('/logout', service_login.logout);
        /*
         * LOGIN
         */
        app.post(require('../../../config/security').get.security.form_login.login_check, service_login.login_check);
        /*
         * INSCRIPTION
         */
        app.post(require('../../../config/security').get.security.inscription.inscription_check, service_login.inscription_check);
    }

        /*
         * Route vers le dossier public et affichage des css javascripts et images
         */

        app.get('/public/:type/:param1/:param2?/:param3?/:param4?/:param5?', require('./publicData'));

    /*
     * 401 Unautorised
     */
    app.get('/401', function(req, res){
        res.render('src/401')
    });
    /*
     * Renvoie d'une erreur 404 dans le cas où aucune page ne serait trouvée.
     */
    app.get('*', function(req, res){
        res.render('src/404');
    });
};







