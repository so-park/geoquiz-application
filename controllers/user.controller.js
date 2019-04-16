const User = require('../models/user.model.js');
var ObjectId = require('mongodb').ObjectID;

exports.create = function CreateHandler(request, response){
};

exports.checkUser = function CheckUserHandler(request,response){
	console.log(request.body);
  const id = request.body.id;
  const password = request.body.password;

	User.find({"userId": id})
		.then(function HandleFind(user){
      if (users.length < 1){
        console.log(typeof(user));
        response.render("login",{message: "Username does not exist."});
      }
      else{
        if (user.password == password){
          response.render("crud");
        }
        else{
          response.redner("login",{message: "Incorrect Password"});
        }
      }
		}).catch(function HandleException(err){
			response.status(500).send({
				message: err.message || "Some error ocurred on retrieval of user"
			});
		});
}

exports.logout = function Logouthanlder(request,response){

}
