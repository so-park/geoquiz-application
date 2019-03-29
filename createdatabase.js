
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = "geoquiz";

var data = require('./data/countryDatabase.json');



MongoClient.connect(url, function DBConnectHandler(err, client){
	if (err){
		console.log("Error Connecting");
		console.log(err);
		throw err;
	}
	console.log("Connected");
	const db = client.db(dbName);
	db.collection("countries").insertMany(data["features"], function InsertHandler(err, res){
		if (err){
			console.log("Error Inserting data");
			console.log(err);
			throw err;
		}
		console.log(res);
        client.close();
	});

});

/***********
Whenever we are retrieving from the database we must create an object in such
a way that OL will be able to reconstruct
var map;
map["type"] = "FeatureCollection";
map["features"] = The array of data that we retrieve from the database
then we send map to OL as a JSON

accessing the features from a continent:
db.countries.find({ "properties.continent" : "africa"})


***********/


/*
console.log(data["features"]);

var countriesFeatures = data["features"];
for (var i in countriesFeatures)
    console.log(countriesFeatures[i]["properties"]["name"]);
*/
