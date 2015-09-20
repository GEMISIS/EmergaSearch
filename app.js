var express = require('express');
var app = express();

function logDebug(message) {
	if(process.env.npm_package_config_debugInfo) {
		console.log(message);
	}
}

app.set('views', 'Jade Pages');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
	res.render('index', {
		'name': 'Joe'
	});
});

app.get('/motionDetected/', function(req, res) {
        var clientID = req.query.client;
        var motion = req.query.motion;
        if(clientID !== undefined && motion !== undefined) {
                res.send("Success!");
                logDebug("Got client " + clientID + " who saw motion!");
        } else {
                res.send("No parameters!");
                logDebug("Client sent potential motion but no parameters were found.");
        }
});

app.listen(process.env.npm_package_config_port);

console.log("Server started!");
