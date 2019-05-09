const User = require('../models/user.model.js');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
const saltRounds = 10;

var logs="";

exports.create = function CreateHandler(request, response){
  console.log("create user");
  console.log(request.body)

  let hash = bcrypt.hashSync(request.body.password,10);
    var data = new User({
      "userId": request.body.userId,
      "userName": request.body.userName,
      "password": hash
    })

    User.create(data,function InsertHandler(err,res){
      if (err){
        console.log("Error Inserting User data");
        console.log(err);
        throw err;
      }
      console.log(res);
      response.render("manageUser",{message: "User added", logs: logs});
    });
};
exports.manageUser = function ManageUserHandler(request,response){
  if (request.session.userName =="admin"){
    response.render("manageUser",{logs: logs})
  }
  else{
    response.render("login",{message: "Admin Access required to mange users"})
  }
}
exports.delete = function DeleteHandler(request, response){
  console.log("delete user");
  console.log(request.body)
    User.deleteOne({
      userId: request.body.userId
    },function InsertHandler(err,res){
      if (err){
        console.log("Error Removing User data");
        console.log(err);
        throw err;
      }
      console.log(res);
      if (res.n >0){
        response.render("manageUser",{message: "User Removed", logs: logs});
      }
      else{
        response.render("manageUser",{message: "User Does not exist", logs: logs});
      }

    });
  };

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
      console.log("FInd")
      console.log(user)
      if (user.length < 1){
        console.log(typeof(user));
        response.render("login",{message: "Username does not exist."});
      }
      else{
        bcrypt.compare(password, user.password,function(err,result){
          if (result){
            var userName = user.userName
            request.session.user = id;
            request.session.userName = userName

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            console.log(dateTime)
            if (today.getDate() <2 ){
              logs = "";
            }
            logs += "Id: " + id +" Name: " + userName +" Time: " + dateTime +"\n";

          response.render("crud", {userName: userName, userId: user.userId});



            //logs = user.userNmae +" " +dateTime
          }
          else{
            response.render("login",{message: "Incorrect Password."});
          }
        })
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

exports.listUsers = function ListUsersHandler(request,response){
  User.find().then(data=>{
    const userList = data.map (({userId,userName}) =>({ id: userId, name: userName}));
    //response.render("manageUser",{userList:userList, logs: logs});
    response.send(userList);
})}
