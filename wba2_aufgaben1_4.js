/*
**	WEbserver einrichten
*/	

/**
Deklaration eines Mehrdim Arrays in dem die Planetennamen, Durchmesser, Entfernung von der Erde stehen
*/
planeten = new Array;
planeten[0] = 	new Array("Erde", 	"Venus", 	"Mars", 	"Jupiter",	"Saturn", 		"Uranus", 		"Neptun", 	"Merkur");
planeten[1] = new Array("150 Mio", 	"108 Mio", 	"228 Mio", 	"778 Mio", 	"1,433 Mrd", 	"2,872 Mrd", 	"4,495 Mrd","58 Mio");
planeten[2]= new Array("12734",		"12103",	"6772"	,	"138346",	"114632",		"50532",		"49105",	"4879");

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
					Aufgabe 2
					---------

					Abfrage auf die URL 
				*/
				if(pfad == '/planeten'){

					console.log('Pfad:	'+pfad);	
					console.log(data);	

					res.writeHead(200,	"OK",	{'Content-Type':	'text/html'});	
					//res.write('Hallo	'+	daten.name);
					res.write("<html><body>");
					res.write("<table>"); //erstellt in einem HTML Dokument ein Table-Tag

					for (var i = 0; i < planeten.length; i++){	//schleife für jeweils eine Zeile durch hinzufügen des TR-Tags (HTML)
						res.write("<tr>");
						for (var j = 0; j < planeten[0].length ; j++){ //schleife für die Inhalte einer Zeile
							res.write("<td>"+planeten[i][j]+"</td>")
						}
						res.write("</tr>"); 
					}
					res.write("<table>"); //table wird geschlossen

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

		/**
	Aufgabe 1
*/



});	

server.listen(8888);


