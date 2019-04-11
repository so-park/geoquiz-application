
const Country = require('../models/country.model.js');
var ObjectId = require('mongodb').ObjectID;

exports.create = function CreateHandler(request, response){
};

//Find all countries
exports.findAll = function FindAllHandler(request, response){
	console.log("Call to Find All Handler");
	Country.find()
		.then(function HandleFind(countries){
			response.send(countries);
		}).catch(function HandleException(err){
			response.status(500).send({
				message: err.message || "Some error ocurred on retrieval of countries"
			});
		});

};

//Check answers and send information to the result page
exports.checkAnswers = function checkAnswersHandler(request, response){
	var date = new Date();
//var hours = date.getHours();
//	date.setHours(hours + date.getTimezoneOffset()/60);
	console.log("Controller Checking Answers at "+ date.toUTCString());
	// request has all 10 fields!!
	var input = request.body.answer;  //array of 20 inputs cap,name,cap, ....
	var correctAnswers =[]; // array that stores 20 correct answers in the same order as input
	var correct = []; //each item has "wrong","right","halfright"
	var misspell_name, country_name;
	var misspel_capital, capital_name;
	var score=0 ;
	var tenCountries = request.body.id;
	 var isPractice = request.body.practice;


	// var countries = Country.find({"continent": request.body.continent})
		 Country.find({ "_id" : [ObjectId(tenCountries[0]), ObjectId(tenCountries[1]),ObjectId(tenCountries[2]),
	 ObjectId(tenCountries[3]), ObjectId(tenCountries[4]), ObjectId(tenCountries[5]), ObjectId(tenCountries[6]),
 ObjectId(tenCountries[7]), ObjectId(tenCountries[8]),ObjectId(tenCountries[9])] })
			 .then(function HandleFindOne(country){

				 for (var i = 0; i < 10; i++){
					 var countryArray = country.map(c => c._id);
					 var index;
					 for (var j = 0; j<10; j++){
						 if (JSON.stringify(countryArray[j]) == JSON.stringify(tenCountries[i])){
							  index = j;
						 }
					 }
					  var capital = input[2*i].toLowerCase().trim();
					  var name = input[(2*i)+1].toLowerCase().trim();
						var selectedCountry =  country[index].properties;
						capital_name = selectedCountry.capital;
						country_name = selectedCountry.name;
						correctAnswers[2*i]= capital_name[0];
						correctAnswers[(2*i)+1] = country_name[0];

						misspell_name =selectedCountry.misspell_name;
						misspell_capital =selectedCountry.misspell_capital;

						//Check if the inputed capital name is same
						for (var j =0; j < capital_name.length; j++)
						{
							if (capital == capital_name[j].toLowerCase())
							{
								correct[2*i] ="right"
								score += 5;
								break;
							}
							correct[2*i]="wrong"
						}
						if (correct[2*i]=="wrong" && misspell_capital.length != 0)
						{
								for (var j = 0; j < misspell_capital.length ; j++)
								{
										if( capital == misspell_capital[j].toLowerCase() )
										{
													correct[2*i] = "halfright"
													score += 3;
													break;
										}
								}
						}
						if (correct[2*i]=="wrong" && capital ==""){
							input[2*i]="No entry";
						}

						//Check for country names
						for (var j =0; j < country_name.length; j++)
						{
							if (name == country_name[j].toLowerCase())
							{
								correct[(2*i)+1] ="right"
								score += 5;
								break;
							}
							correct[(2*i)+1]="wrong"
						}
						if (correct[(2*i)+1]=="wrong" && misspell_name.length != 0)
						{
								for (var j = 0; j < misspell_name.length ; j++)
								{
										if( capital == misspell_name[j].toLowerCase() )
										{
													correct[(2*i)+1] = "halfright"
													score += 3;
													break;
										}
								}
						}
						if (correct[(2*i)+1]=="wrong" && name ==""){
							input[(2*i)+1]="No entry";
						}


}
				//	 var answersAsComments =JSON.stringify(input);
					 if (isPractice =="true"){
						 console.log("You got " + score + " points in this practice test")
						 response.render("results", {input: input, correctAnswers: correctAnswers, score: score,
							  					correct: correct, practice: isPractice });

					 }
					 else{
						 var hiddenIds = request.body.hidden;
						 console.log("Entered Real quiz for " + hiddenIds +" and grade is " +score)
						response.render("results", {input: input, correctAnswers: correctAnswers, score: score, correct: correct, practice: isPractice,
							 user: hiddenIds[2], assignment: hiddenIds[0], course: hiddenIds[1]});

					 }

			 }).catch(function HandleException(err){
					 response.status(500).send({
						 message: err.message || "Some error ocurred on retrieval of name of countries"
					 });
			});

}

//Get countries in a continent and randomly select 10 countries from it.
exports.sendRandomCountries = function(request, response){
	Country.find({"properties.continent": request.params.continent})
		.then(function HandleFindOne(continent){
			if (!continent){
				return response.status(404).send({
					message: "No Country not found with continent " + request.params.continent
				});
			}
			var tenCountries = [];

			// Creates an array of 10 elements
			var randomCountries = new Array(10);
			// Selects 10 integer random numbers that don't repeat
			console.log("before " + continent.length + " " + request.params.continent);
			for (var i = 0; i < randomCountries.length; i++) {
				var randomNumber = parseInt(Math.random() * continent.length);
			  	while (randomCountries.includes(randomNumber)){
			    	randomNumber = parseInt(Math.random() * continent.length);
			  	}
			  	randomCountries[i] = randomNumber;

			}

			//randomCountries countain ten random numbers that indicate the selected countries
			console.log("after " + randomCountries.length + " " + randomCountries);
	        for (var c in randomCountries){
	            var oneCountry = new Object;
							oneCountry.id = continent[randomCountries[c]]._id;
	            oneCountry.type = continent[randomCountries[c]].type;
	            oneCountry.properties = new Object;
						//oneCountry.properties.name = continent[randomCountries[c]].properties.name;
							oneCountry.geometry = continent[randomCountries[c]].geometry;

							if(continent[randomCountries[c]].properties.center != undefined){
								oneCountry.properties.center = continent[randomCountries[c]].properties.center;
							}

							// For countries in Oceania that cross 180 line ( date line) so when it is zoomed in,
							// it actually zooms out because it has to grap the other side of the map
							if (request.params.continent =="oceania"){
								if (continent[randomCountries[c]].properties.code){
									oneCountry.properties.code = continent[randomCountries[c]].properties.code;
								}
							}

	            tenCountries.push(oneCountry);
							console.log(continent[randomCountries[c]].properties.name);
	        }

			var map = new Object;
			map["type"] = "FeatureCollection";
			map["features"] = tenCountries;

			response.send(tenCountries);

		}).catch(function HandleException(err){
			if (err.kind === 'ObjectId') {
				return response.status(404).send({
					message: "Country not found with id " + request.params.continent
				});
			}
			return response.status(500).send({
				message: "Error retrieving countries of continent " + request.params.continent + " " + err
			});
		});

};

//background continent and countries
exports.allButOneContinent = function(request, response){
	Country.find()
		.then(function HandleFind(allCountries){

		var output = [];
			for (var i = 0; i < allCountries.length; i++){
				 if (allCountries[i].properties.continent != request.params.continent){
					if (request.params.continent == "oceania"){
						if (allCountries[i].properties.name == "United States")
							continue;
					}
					if (request.params.continent =="north-america"){
						if (allCountries[i].properties.name =="Hawaii")
							continue;
					}

					var oneCountry = new Object;
					oneCountry.id = allCountries[i]._id;
					oneCountry.type = allCountries[i].type;
					oneCountry.geometry = allCountries[i].geometry;
					oneCountry.properties = new Object;
					if (allCountries[i].properties.name =="BB"){

						oneCountry.properties.name = allCountries[i].properties.name;
						oneCountry.properties.code = allCountries[i].properties.code;
					}

					output.push(oneCountry);
				}

			}
			var map = new Object;
			map["type"] = "FeatureCollection";
			map["features"] = output;
			response.send(map);

			}).catch(function HandleException(err){
				response.status(500).send({
					message: err.message || "Some error ocurred on retrieval of countries"
				});
			});
};
var countries = [];
var borders ;

exports.findCountriesInContinent = function FindOneHandler(request, response){
	Country.find({"properties.continent": request.params.continent})
		.then(function HandleFindOne(country){
			if (!country){
				return response.status(404).send({
					message: "No Country found with continent " + request.params.continent
				});
			}

			var countryGeometry =[]; //country geometry without the oceanic borders

	        for (var c in country){
	            var oneCountry = new Object;
	            oneCountry.type = country[c].type;
	            oneCountry.properties = new Object;
	            oneCountry.properties.id= country[c].properties.id;
							oneCountry.id= country[c]._id;

							oneCountry.geometry = country[c].geometry;

							if (request.params.continent =="oceania" && country[c].properties.code!= undefined){
								oneCountry.properties.code = country[c].properties.code;
							}
							countries.push(oneCountry);
	        }

			var map = new Object;
			map["type"] = "FeatureCollection";
			map["features"] = countries;
			response.send(map);
		}).catch(function HandleException(err){
			if (err.kind === 'ObjectId') {
				return response.status(404).send({
					message: "Country not found with id " + request.params.continent
				});
			}
			return response.status(500).send({
				message: "Error retrieving countries of continent " + request.params.continent + " " + err
			});
		});

};


exports.selectContinent = function SelectContinentHandler (request, response){
	//Practice quiz
	var continent = request.body.continent;
	var practice =true;
	response.render('index', {practice: practice, continent: continent});
}


exports.getCountryInfo =function getCountryHandler(request, response){
	console.log("accessing database");
	console.log(request.query.countryName);
	 Country.find({ "properties.name" : request.query.countryName}).
	 then(function HandleFindOne(data){
		 console.log(data);
		 response.render("crud", {data:data});
	} )
};

exports.update = function UpdateHandler(request, response){
		// console.log("update handler entered");
	//	console.log(request)
		var data = request.body
		var value = data.value;
		console.log(value)
		// //console.log(JSON.parse(request[0]));
		console.log("here")
		console.log(data.field)
		var field =data.field;
		console.log(typeof(data.id))
		if (data.field == "altName"){
			field ="properties.name"
			// field = data.field
			value.unshift(data.name)
			console.log(value)
		}
		if (data.field == "altCapital"){
			field == "properties.capital";
			value.unshift(data.name)
		}
		var obj ={};
				obj[data.field] = value

		// console.log(data.name)
		Country.updateOne(
			{"_id": ObjectId(data.id)},
			{$set:	{
					[field]: value
			}
			}).then(function HandleUpdateOne(res){
				console.log("done")
				console.log(res)
				response.send("success");

			}).catch(error=>{
				console.log(error)
			})


};

exports.addData =function addDataHandler(request, response){
	console.log("add data");
	console.log(request.body);
	var data = request.body;
	Country.updateOne(
		{"_id": data.id},
		{$push:
			{
				[data.field]: data.value
			}
		}
	).then(res=>{
		console.log(res)
		response.send("success")
	});
	//  Country.find({ "properties.name" : request.query.countryName}).
	//  then(function HandleFindOne(data){
	// 	 console.log(data);
	// 	 response.render("crud", {data:data});
	// } )
};
exports.delete = function DeleteHandler(request, response){
	console.log("delete");
	var data = request.body;
	console.log(data)
	Country.updateOne(
		{"_id": data.id},
		{$pull:
			{
				[data.field]: data.value
			}
		}
	).then(res=>{
		console.log(res)
	//	response.json(res)
	});
	response.send();
};

exports.delete = function DeleteHandler(request, response){
	console.log("delete");
	var data = request.body;
	console.log(data)
	Country.updateOne(
		{"_id": data.id},
		{$pull:
			{
				[data.field]: data.value
			}
		}
	).then(res=>{
		console.log(res)
	//	response.json(res)
	});
	response.send();
};

exports.addCountry = function AddCountryHandler(request, response){
	console.log("addCountry");
	console.log(request.body);
	var data = request.body;
	var properties={
		continent: data.continent;
		capital: data.capital;
		name: data.name;
		misspell_capital: data.misspell_capital,
		misspell_name: data.misspell_name
	};
	for (var field in properties){
		
	}
	properties[continent] = data.continent;

	// Country.updateOne(
	// 	{"_id": data.id},
	// 	{$pull:
	// 		{
	// 			[data.field]: data.value
	// 		}
	// 	}
	// ).then(res=>{
	// 	console.log(res)
	// //	response.json(res)
	// });
	//response.send();
};
