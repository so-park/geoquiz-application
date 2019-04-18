const User = require('../models/user.model.js');
var ObjectId = require('mongodb').ObjectID;
var formidable = require('formidable');
var fs = require('fs');


exports.create = function CreateHandler(request, response){
  console.log("create user");
  console.log(request.body)
  var data = {
    "userId": request.body.userId,
    "userName": request.body.userName,
    "password": request.body.password
  }
  //console.log(User)
  User.create(data,function InsertHandler(err,res){
		if (err){
			console.log("Error Inserting User data");
			console.log(err);
			throw err;
		}
		console.log(res);
    response.render("createUser",{message: "User added"});
  });
};

// var auth = function(req, res, next) {
//   if (req.session)
//     return next();
//   else
//     return res.sendStatus(401);
// };

exports.checkUser = function CheckUserHandler(request,response){
	console.log(request.body);
  const id = request.body.id;
  const password = request.body.password;
  console.log(request.session);
  if (request.session == undefined){
    response.render("login", {message: "Login required"});
  }

	User.findOne({"userId": id})
		.then(function HandleFind(user){
      console.log(user)
      if (user.length < 1){
        console.log(typeof(user));
        response.render("login",{message: "Username does not exist."});
      }
      else{
        if (user.password == password){
          request.session.user = id;
          var userName = user.userName
          // response.header('Cache-Control', 'no-cache, no-store, must-revalidate,post-check=0, pre-check=0');
          response.render("crud", {userName: userName});
        }
        else{
          response.render("login",{message: "Incorrect Password."});
        }
      }
		}).catch(function HandleException(err){
			response.status(500).send({
				message: err.message || "Some error ocurred on retrieval of user"
			});
		});
}

exports.logout = function Logouthanlder(request,response){
  console.log(request.session)
  request.session.destroy();

  response.header('Cache-Control', 'no-cache, no-store, must-revalidate,post-check=0, pre-check=0');
  response.render("login",{message:"logout Success!"});
}

exports.fileUpload = function handlefileUpload(request, response){
			var data;
			new formidable.IncomingForm().parse(request,(err,fields,file) =>{
				fs.readFile(file.file.path,"utf8", function(err,res){
          console.log(res);
          data = res;
          console.log("data "+ data)
        //  console.log("data json "+ JSON.parse(data));
          console.log(typeof(data));

				})

      //  console.log(data.length);

			})

      response.render("fileUpload")
}
