var planeten = [
{ "Planet":"Erde" , "Entfernung":"150 Mio" ,  "Durchmesser":"12734" },
{ "Planet":"Venus" , "Entfernung":"108 Mio" ,  "Durchmesser":"12103" }, 
{ "Planet":"Mars" , "Entfernung":"228 Mio" ,  "Durchmesser":"6772" }, 
{ "Planet":"Jupiter" , "Entfernung":"778 Mio" ,  "Durchmesser":"138346" }, 
{ "Planet":"Saturn" , "Entfernung":"1,433 Mrd" ,  "Durchmesser":"114632" }, 
{ "Planet":"Uranus" , "Entfernung":"2,872 Mrd" ,  "Durchmesser":"50532" }, 
{ "Planet":"Neptun" , "Entfernung":"4,495 Mrd" ,  "Durchmesser":"49105" },
{ "Planet":"Merkur" , "Entfernung":"58 Mio" ,  "Durchmesser":"48789" }
];

var express = require('express');
var app = express();

app.configure(function(){
	
	app.use(express.static(__dirname + '/public'));
	app.use(express.json());
	app.use(express.urlencoded());

});

app.get('/planeten', function(req, res){
		res.write("<html><body>");
		res.write("<table>"); //erstellt in einem HTML Dokument ein Table-Tag

		res.write("<tr><th>Planeten</th><th>Entfernung zur Sonne</th><th>Durchmesser</th></tr>");
        planeten.forEach(function(planeten){
        res.write("<tr><td>" +planeten.Planet+  "</td><td>" +planeten.Entfernung+ "</td><td>" +planeten.Durchmesser+ "</td></tr>"); });
                    
		res.write("</table>"); //table wird geschlossen
		res.end();
	});

app.post('/planeten', function(req, res){

	planeten.push(req.body);

	req.end();

});
app.listen(3000);