var express = require('express');
var app = express();

var roomData = [];

function logDebug(message) {
    if(process.env.npm_package_config_debugInfo) {
            console.log(message);
    }
}

function storeData(clientID, time) {
	roomData.push({clientID: clientID, time: time});
}

app.set('views', 'Jade Pages');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index', {
            'name': 'Demo Room',
            'data': JSON.stringify(roomData)
    });
});

app.get('/motionDetected/', function(req, res) {
    var clientID = req.query.client;
    var motion = req.query.motion;
    if(clientID !== undefined && motion !== undefined) {
            res.send("Success!");
            storeData(clientID, (new Date()).getTime());
            logDebug("Got client " + clientID + " who saw motion!");
    } else {
            res.send("No parameters!");
            storeData("unknown", (new Date()).getTime());
            logDebug("Client sent potential motion but no parameters were found.");
    }
});

app.listen(process.env.npm_package_config_port);

console.log("Server started!");
