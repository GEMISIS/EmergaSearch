var express = require('express');
var app = express();

app.get('/', function(req, res) {
        var clientID = req.query.client;
        var motion = req.query.motion;
        if(clientID !== undefined && motion !== undefined) {
                res.send("Success!");
                console.log("Got client " + clientID + "who saw motion!");
        } else {
                res.send("No parameters!");
                console.log("Got client but no info was sent!");
        }
});

app.listen(8080);

console.log("Server started!");
