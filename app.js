var express = require('express');
var app = express();

var fs = require("fs");
var file = "motionevenlog.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();

function logDebug(message) {
    if(process.env.npm_package_config_debugInfo) {
            console.log(message);
    }
}
function dbStoreEvent(sensorid, time){
    var db = new sqlite3.Database(file);
    db.serialize(function(){
        if(!exists){
                db.run("CREATE TABLE events (sensorid TEXT, time TEXT)");
        }
        var statement = db.prepare("INSERT INTO events VALUES (?,?)");
        statement.run(sensorid, time);
        statement.finalize();
    });
    db.close();
}
function dbRetrieveEvents(){
    var db = new sqlite3.Database(file);
    var returned;
    db.serialize(function(){
            db.each("SELECT rowid AS id, sensorid, time FROM events", function(err, row){
            //console.log(row.id + ": " + row.sensorid + row.time);
            returned = row.id + ": " + row.sensorid + " " + row.time;
    	});
    });
    db.close();
    return returned;
}

app.set('views', 'Jade Pages');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

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
