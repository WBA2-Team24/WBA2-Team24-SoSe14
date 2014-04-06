var express = require('express');
var app = express();
var faye = require('faye');
var http = require('http');
//Server Objekt wird erstellt
server = http.createServer(app);
//Faye configs für Node
var bayeux = new faye.NodeAdapter({
	mount: '/faye',
	timeout: 45
});
//hängt NodeAdapter an den HTTP-Server
bayeux.attach(server);
var mongoDB = require('mongoskin');
var db = mongoDB.db('mongodb://localhost/planeten?auto_reconnect=true', {safe: true});

db.bind("planeten"); //legt die Datenbank "Planeten" als zu benutzende DB fest

var planetsCollection = db.planeten;	//DB inhalt wird in ein Objekt gespeichert

var pubClient = bayeux.getClient();	//erstelle Public Subscribe Client

//Configs für Middleware
app.configure(function(){
	
	app.use(express.static(__dirname + '/public'));	//setzt /public als default Ordner
	app.use(express.json());		//beim request wird ein JSON objekt geparsed
	app.use(express.urlencoded());

});

app.use(function(error, request, response, next){
	console.error(error.stack);
	response.end(error.messages);
});

app.set('port', 3000);	//Port 3000 festlegen

//POST 
app.post('/planeten', function(req, res, next){
		//übergebene Daten mit .insert() in die DB hinein schreiben
		planetsCollection.insert(req.body, function(error, planeten){
			if(error)
				next(error);
			else{
				res.end();
			}
		});

	var publication = pubClient.publish('/planeten', req.body);

	publication.then(function(){
		res.writeHead(200, "OK");
		res.write("Messages sent!");
	});
});

//GET auf Planeten
app.get('/planeten', function(request, response, next){
		//Daten aus der Datenbank abrufen
		planetsCollection.findItems(function(error, result){
			if(error){
				console.log("Fehler im GET:" +error);
				next(error);
			}
			//JSON-File an Client übertragen	
			else{
				response.writeHead(200, {
					'Content-Type':'application/json'
				});
				console.log("Das ist Data: " +JSON.stringify(result));
				response.end(JSON.stringify(result));
				response.end();
			}
		});
	});

server.listen(app.get('port'), function(){
	console.log('Server horcht an Port 3000!')
});