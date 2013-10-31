var path = require('path');
var rootPath = path.resolve(__dirname , '../../../');

module.exports = function (req, res) {

    var fs = require('fs');
    var file = req.params.param1;
    if( req.params.param2){
        file+='/'+req.params.params2;
        if(typeof req.params.param3){
            file+='/'+req.params.params3;
            if(typeof req.params.param4){
                file+='/'+req.params.params4;
                if(typeof req.params.param5){
                    file+='/'+req.params.params5;

                }
            }
        }
    }


    if(req.params.type == "stylesheets") {

        fs.readFile(rootPath+ 'public/stylesheets/'+file, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });
    }
    if(req.params.type == "javascripts") {

        fs.readFile(rootPath + 'public/javascripts/'+file, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });
    }
    if(req.params.type == "images") {

        fs.readFile(rootPath + 'public/images/'+file, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(data);
            res.end();
        });
    }

}

