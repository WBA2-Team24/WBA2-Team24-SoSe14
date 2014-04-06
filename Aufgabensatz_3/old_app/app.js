var express = require('express');
var app = express();
var mongoDB = require('mongoskin');
var db = mongoDB.db('mongodb://localhost/planeten', {safe: true});



var planetsCollection = db.planeten;



/*var planeten = [
{ planet:"Erde" , entfernung:"150 Mio" ,  durchmesser:"12734" },
{ planet:"Venus" , entfernung:"108 Mio" ,  durchmesser:"12103" }, 
{ planet:"Mars" , entfernung:"228 Mio" ,  durchmesser:"6772" }, 
{ planet:"Jupiter" , entfernung:"778 Mio" ,  durchmesser:"138346" }, 
{ planet:"Saturn" , entfernung:"1,433 Mrd" ,  durchmesser:"114632" }, 
{ planet:"Uranus" , entfernung:"2,872 Mrd" ,  durchmesser:"50532" }, 
{ planet:"Neptun" , entfernung:"4,495 Mrd" ,  durchmesser:"49105" },
{ planet:"Merkur" , entfernung:"58 Mio" ,  durchmesser:"48789" }
];
*/
app.configure(function () {
	
	app.use(express.static(__dirname + '/public'));	//setzt /public als default Ordner
	app.use(express.json());		//beim request wird ein JSON objekt geparsed
	app.use(express.urlencoded());

});

app.use(function (error, request, response, next){
	console.error(error.stack);
	response.end(error.messages);
});

app.post('/planeten', function(req, res, next){
		planetsCollection.insert(function(err, result){
			if(err)
				next(err);
			else{
				res.writeHead(200, {
					'Content-Type':'application/json'
				});
				res.end(JSON.stringify(result));
				res.end();
			}
		});
	});

app.get('/planeten', function(req, res, next){

		planetsCollection.findItems(function(err, result){
			if(err)
				next(err);
			else{
				res.writeHead(200, {
					'Content-Type':'application/json'
				});
				res.end(JSON.stringify(result));
				res.end();
			}
		});
	});

/*app.post('/planeten', function(req, res){
	console.log("JSON Inhalt:"+req.body.entfernung);
	planeten.push(req.body);	//pushed die Formulareingabe in das JSON-Array
	res.writeHead(200);
	res.end();

});*/

app.listen(3000, function(){
	console.log('Server horcht an Port 3000!')
});