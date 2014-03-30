var http = require('http');
var express = require('express');
var app = express();

var planeten = [
{ planet:"Erde" , entfernung:"150 Mio" ,  durchmesser:"12734" },
{ planet:"Venus" , entfernung:"108 Mio" ,  durchmesser:"12103" }, 
{ planet:"Mars" , entfernung:"228 Mio" ,  durchmesser:"6772" }, 
{ planet:"Jupiter" , entfernung:"778 Mio" ,  durchmesser:"138346" }, 
{ planet:"Saturn" , entfernung:"1,433 Mrd" ,  durchmesser:"114632" }, 
{ planet:"Uranus" , entfernung:"2,872 Mrd" ,  durchmesser:"50532" }, 
{ planet:"Neptun" , entfernung:"4,495 Mrd" ,  durchmesser:"49105" },
{ planet:"Merkur" , entfernung:"58 Mio" ,  durchmesser:"48789" }
];

app.configure(function(){
	
	app.use(express.static(__dirname + '/public'));	//setzt /public als default Ordner
	app.use(express.json());		//beim request wird ein JSON objekt geparsed
	app.use(express.urlencoded());

});

app.get('/planeten', function(req, res){
		res.writeHead(200, "OK");
		res.write("<html><body>");
		res.write("<table>"); //erstellt in einem HTML Dokument ein Table-Tag

		res.write("<tr><th>Planeten</th><th>Entfernung zur Sonne</th><th>Durchmesser</th></tr>");
        planeten.forEach(function(planeten){
        res.write("<tr><td>" +planeten.planet+  "</td><td>" +planeten.entfernung+ "</td><td>" +planeten.durchmesser+ "</td></tr>"); });
                    
		res.write("</table>"); //table wird geschlossen
		res.end();
	});

app.post('/planeten', function(req, res){
	console.log("JSON Inhalt:"+req.body.entfernung);
	planeten.push(req.body);	//pushed die Formulareingabe in das JSON-Array
	res.writeHead(200);
	res.end();

});
app.listen(3000);