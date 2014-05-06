var mongoDB = require('mongoskin');

//Verbindung zur Datenbank herstellen
//safe = true damit "err" und "result" in Callbacks gefuellt werden
var db = mongoDB.db('mongodb://localhost/mitfahrgelegenheit-finden?auto_reconnect=true', {
    safe: true
});

//Collection "fahrt" binden
db.bind("fahrtangebote");
var suche = db.fahrtangebote;

//Attribut "id" indizieren
db.fahrtangebote.ensureIndex({
    id: 1
}, function (err, replies) {});

var store = {

    //Alle Items der Collection abrufen
    findAllFahrten: function (callback) {
        suche.findItems(callback);
    },
    findSomeFahrten: function (callback) {
        suche.find(callback);
    },

    //Item einer Collection hinzufügen
    insertFahrt: function (fahrt, callback) {
         db.fahrtangebote.insert(planet, callback);
    },

    //Item mit der angegebenen ID abrufen
    findOneFahrt: function (objectID, callback) {
         db.fahrtangebote.findById(objectID, callback);
    },

    //Item mit der angegebenen ID löschen
    removeOneFahrt: function (objectID, callback) {
         db.fahrtangebote.removeById(objectID, callback);

    }
};

//Modul exportieren
module.exports = store;