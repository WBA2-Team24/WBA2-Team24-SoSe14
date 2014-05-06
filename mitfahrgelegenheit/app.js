// Requires
var express = require('express');
var faye = require('faye');
var http = require('http');
var stylus = require('stylus');
var nib  = require('nib');
var ejs = require('ejs');
var mongoDB = require('mongoskin');

var dateNow = new Date();
var year = dateNow.getFullYear();
var month = dateNow.getMonth()+1;
var day = dateNow.getDate();

if(month > 9 && day > 9)
	var act_date = year+'-1'+month+'-1'+day;
else if(month > 9 && day < 9)
	var act_date = year+'-1'+month+'-0'+day;
else if(month < 9 && day > 9)
	var act_date = year+'-0'+month+'-1'+day;
else if(month < 9 && day < 9)
	var act_date = year+'-0'+month+'-0'+day;

var f_id;

//Verbindung zur Datenbank herstellen
//safe = true damit "err" und "result" in Callbacks gefuellt werden
var db = mongoDB.db('mongodb://localhost/mitfahrgelegenheit-finden?auto_reconnect=true', {
    safe: true
});

//Collection "fahrt" binden
db.bind("fahrtangebote");
var eintrag = db.fahrtangebote;
var suche = db.fahrtangebote;

var app = express();
var helpers = require('express-helpers');
helpers(app);
var server = http.createServer(app);

var store = require('./store.js');
app.engine('.html', require('ejs').__express);

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
//Verzeichnis definieren in der Jade nach Templates sucht
app.set('views', __dirname + '/views');
//Standard-Template-Engine festlegen
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
// Statischen Pfad für Express definieren
app.use(express.static(__dirname + '/public'));
// Anstatt app.use(express.bodyParser()); -> veraltet
app.use(express.json());
app.use(express.urlencoded());

// Errorhandler
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.writeHead(500);
	res.end(err.messages);
});

// Nodeadapter konfigurieren
var bayeux = new faye.NodeAdapter({
	mount: '/faye',
	timeout: 45
});

// Nodeadapter zu http-Server hinzufügen
bayeux.attach(server);

//PubSub-Client erzeugen
var pubClient = bayeux.getClient();
var search =[{from:"",to:""}];
var defaultSearch = [{from:"",to:""}];
//JSON Array für die Navigation der EJS
var navigation = [
  { name: 'suche' },
  { name: 'fahrt-anbieten' }
];

// GET für Index, EJS Compiler rendert index.ejs mit den Übergabeparametern Title und Navigation
app.get('/', function (req, res, next) {
		res.render('index', {
				title: "Mitfahrzentrale",
				navigation: navigation
		});
});

// GET für Index, EJS Compiler rendert index.ejs mit den Übergabeparametern Title und Navigation
app.get('/fahrt-anbieten', function (req, res, next) {

	res.render('fahrt-angebot-erstellen', {
			title: "Mitfahrzentrale - Fahrt anbieten",
			navigation: navigation
	});
});

app.post('/fahrt-anbieten', function (req, res, next) {
	var id = Math.round(Math.random() * (1000000000 - 1)) + 1;
	create = [
		{
			"from":req.body.from,
			"to":req.body.to,
			"date":req.body.date,
			"time":req.body.time,
			"price":req.body.price,
			"vehicle":req.body.vehicle,
			"seats":req.body.seats,
			"email":req.body.email,
			"id": id.toString()
		}];
	
	//console.log(act_date);
	if(create[0].from && create[0].to && create[0].date && create[0].time && create[0].price && create[0].seats && create[0].email){
		//if(create[0].date > act_date){ //eingetragenes Datum mit aktuellem Datum vergleichen
		eintrag.insert(create, function(error, fahrt) {
			// Error handling
			if(error) 
				next(error);

			else{
				console.log("ALl: "+JSON.stringify(fahrt));
				f_id = fahrt[0].id;		//ID aus der DB
				res.redirect('detailansicht/'+f_id); //
				res.end();
			}
		});
	}	
	else{
		res.redirect('fahrt-anbieten');
	}
});

app.get('/detailansicht/:id', function(req, res, next){
	
	var ID = req.params.id;	
	console.log("ID: "+ID);
	console.log(eintrag.find({id:ID}).toArray(function (err, result) {
			//Fehler bei der Datenbankabfrage ist aufgetreten		
			if (err) {
				res.writeHead(500, "Es ist ein Fehler aufgetreten");
			}
			//Wenn Datenbankafrage erfolgreich
			else {
				console.log("Result: "+JSON.stringify(result));
				//JSON-Daten an Template übergeben und Template rendern
				res.render('detailansicht', {
					title: "Fahrtdetails",
					navigation: navigation,
					fahrt: result
				});
			}
		}));
});

//GET für die Suche, EJS compiler rendert mitfahrgelgenheit-finden.ejs
app.get('/suche', function (req, res, next) {
	res.render('suche', {
			title: "Suche nach Mitfahrgelegenheit",
			navigation: navigation
		});
});
//POST um die Sucheingabe zu übergeben
app.post('/mitfahrgelegenheit-finden', function(req, res){
	//JSON die die Suchinhalte beinhaltet
	search = [{"from":req.body.from,"to":req.body.to}];

	res.redirect('mitfahrgelegenheit-finden');
	res.end();
});
// GET um Suchergebnisse anzuzeigen
app.get('/mitfahrgelegenheit-finden', function (req, res) {
	if(search == undefined || search[0].from == ""|| search[0].to == ""){
			store.findAllFahrten(function (err, result) {
			//Fehler bei der Datenbankabfrage ist aufgetreten
			if (err) {
				res.writeHead(500, "Es ist ein Fehler aufgetreten");
			}
			//Wenn Datenbankafrage erfolgreich
			else {
				//JSON-Daten an Template übergeben und Template rendern
				res.render('mitfahrgelegenheit-angebote', {
					title: "Anzeige der Mitfahrgelegenheiten",
					navigation: navigation,
					search: result
				});
			}
		});
	}
	else{
		suche.find({from:search[0].from, to:search[0].to}).toArray(function (err, result) {
			//Fehler bei der Datenbankabfrage ist aufgetreten
		
			if (err) {
				res.writeHead(500, "Es ist ein Fehler aufgetreten");
			}
			//Wenn Datenbankafrage erfolgreich
			else {
				//JSON-Daten an Template übergeben und Template rendern
				res.render('mitfahrgelegenheit-angebote', {
					title: "Anzeige der Mitfahrgelegenheiten",
					navigation: navigation,
					search: result
				});
			}
		});
	}
});

server.listen(3000, function () {
	console.log('Server listens on port 3000.');
});