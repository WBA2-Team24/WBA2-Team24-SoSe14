/**************************************************************
*						Team 24
*			Titel: WBA2 SoSe14 Aufgaben 1-4
*					Thema: Node js
*					Datum: 19.03.2014
*	Mitglieder:Niklas Rose, Christian Grevenbrück, Sven B.
***************************************************************/
/**
Deklaration eines Mehrdim Arrays in dem die Planetennamen, Durchmesser, Entfernung von der Erde stehen
*/

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
/*planeten = new Array;
planeten[0] = 	new Array("Erde", 	"Venus", 	"Mars", 	"Jupiter",	"Saturn", 		"Uranus", 		"Neptun", 	"Merkur");
planeten[1] = new Array("150 Mio", 	"108 Mio", 	"228 Mio", 	"778 Mio", 	"1,433 Mrd", 	"2,872 Mrd", 	"4,495 Mrd","58 Mio");
planeten[2]= new Array("12734",		"12103",	"6772"	,	"138346",	"114632",		"50532",		"49105",	"4879");*/

/*
*	Webserver einrichten
*/	
var	http	=	require('http');	
var	querystring	=	require('querystring');	
var	url	=	require('url');	

var	server	=	http.createServer();	

server.on('request',	function(req,	res){	

		console.log('HTTP-Request	gestartet')	
		console.log('HTTP-Methode:	'+req.method);	
		var	body	=	'';	

		req.on('data',	function(data){	
				body	=	body	+	data.toString();	
		});	

		req.on('end',	function(){	
				console.log('HTTP-Request	zu	Ende');	
				var	data	=	querystring.parse(body);	
				var	pfad	=	url.parse(req.url).pathname;
				
				/**
				*	Aufgabe 2
				*	--------- 
				*/
				if(pfad == '/planeten'){	//korrekter Pfad wird verglichen mit der Eingabe
					console.log('Pfad:	'+pfad);	
					console.log(data);	

					res.writeHead(200,	"OK",	{'Content-Type':	'text/html'});	

					/**
					*	Aufgabe 1
					*	---------
					*/
					res.write("<html><body>");
					res.write("<table>"); //erstellt in einem HTML Dokument ein Table-Tag

					res.write("<tr><th>Planeten</th><th>Entfernung zur Sonne</th><th>Durchmesser</th></tr>");
                    planeten.forEach(function(planeten){
                        res.write("<tr><td>" +planeten.Planet+  "</td><td>" +planeten.Entfernung+ "</td><td>" +planeten.Durchmesser+ "</td></tr>"); });
                    
					res.write("</table>"); //table wird geschlossen

					/**
					*	Aufgabe 3
						---------

						Erstellung eines Formulares 
					*/
					res.write("<form action='http://localhost:8888/planeten' method='POST'>");
					res.write("<br><br><br>Planetennamen: <input type='text' name='planet'> <br>");
					res.write("Planetdurchmesser: <input type='text' name='diameter'> <br>");
					res.write("Entfernung: <input type='text' name='distance'> <br>");
					res.write("<input type='submit' value='SEND' >");
					res.write("</form>");
					res.write("</html></body>");

					/**
					*	Aufgabe 4
					*	---------
					*/
					if(req.method == 'POST'){	//Überprüfung ob Method(form) POST ist
						//POST - Daten werden in eine Variable gespeichert(zur Übersicht)
						//und an das PlanetenArray dran gehangen
						var planetName = data.planet;		
						var planetDiameter = data.diameter;
						var planetDistance = data.distance;

						planeten[0].push(planetName);
						planeten[1].push(planetDistance);
						planeten[2].push(planetDiameter);	
					}
				}
				res.end();	
		});	
});	
server.listen(8888);


