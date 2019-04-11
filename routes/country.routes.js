var express = require('express');
var httpRequest = require('request');
var router = express.Router();
const path = require('path');
//use locally
require('dotenv').config();
token = process.env.TOKEN
const countries = require('../controllers/country.controller.js');

router.get ('/', function handleHomePage(request, response) {
	console.log("index called");
	response.render('practice');
});

//For professors to add/edit database
router.get('/crud', function handleAccessDBPage(request, response){
	response.render("crud");
})

router.post('/',function handleAfricaPage(request, response) {
	response.render('practice');
});

router.post('/checkanswers', countries.checkAnswers);
router.post('/selectContinent', countries.selectContinent);
router.post('/submission', function handleSubmissionsPage(request, response){
		console.log("Entered Automatic Submission")
		var inputs = request.body.studentsAnswers;
		var comments ="";
		var newScore = request.body.score;
		for (var i =0; i < 10; i++){
			comments += (i+1) + ". " + inputs[i*2] + " " + inputs[(i*2)+1] + "\n";
		}
		comments += "Score: " + newScore;
		console.log("After contructing formatted comments" + comments);
	//	console.log("This is the answers entered router to send to comments " + inputs);


		httpRequest({
			method: "GET",
			url: "https://canvas.spu.edu/api/v1/courses/"+ request.body.courseId+ "/assignments/"
									+ request.body.assignmentId + "/submissions/"+ request.body.userId,
			headers:{
					 "Content-Type": "application/json",
					 "Authorization": " Bearer " + token

				}
		},function(err,res,body) {
			if (!err && res.statusCode == 200) {
					 var updateScore = parseInt(JSON.parse(res.body).grade)
					 //When there is no value in updateScore, the value can't be parsed into an integer
					 	if ((updateScore < newScore) || (isNaN(updateScore))){
								updateScore = newScore;
						}
						 		httpRequest({
						 				method: "PUT",
						 				uri: "https://canvas.spu.edu/api/v1/courses/"+ request.body.courseId+ "/assignments/"
						 										+ request.body.assignmentId + "/submissions/"+ request.body.userId,
						 			 headers:{
						 						"Content-Type": "application/json",
						 						"Authorization": " Bearer " +token

						 				 },
						 				 form: {
						 					 	'course_id': request.body.courseId,
						 						'assignment_id': request.body.assignmentId,
						 						'user_id': request.body.userId,
						 						'author_id': request.body.userId,
						 						 'submission[posted_grade]': updateScore,
						 						 "workflow_state": "graded",
						 						 "comment[text_comment]": comments
						 				 }
						 		 	},function (er,res,body){
						 			 if (!er && res.statusCode == 200) {
						 						console.log("Grade Entered");
						 					response.status(204).send();
						 				}
						 				else{
						 					console.log(res);
											console.log(er)
						 				}
						 		 })
	  }
	})
});
	 router.post('/quizStarted', function handlequizStarted(request,response){
	 	// console.log("entered quizStarted router")
	 	httpRequest({
	 			method: "PUT",
	 			uri: "https://canvas.spu.edu/api/v1/courses/"+ request.body.courseId+ "/assignments/"
	 									+request.body.assignmentId + "/submissions/"+ request.body.userId,
	 		 headers:{
	 					"Content-Type": "application/json",
	 					"Authorization": " Bearer " + token

	 			 },
	 			 form: {
	 					'course_id':  request.body.courseId,
	 					'assignment_id': request.body.assignmentId,
	 					'user_id': request.body.userId,
	 					"comment[text_comment]": "Quiz started"
	 			 }
	 		},function (er,res,body){
	 		 if (!er && res.statusCode == 200) {
	 				console.log("Quiz Started Comment Sent");
	 				response.status(204).send();
	 			}
	 			else{
	 				console.log(er);
	 				console.log(res);
	 			}
	 	 });
		})
router.post('/addData', countries.addData);
router.post('/deleteData', countries.delete);
router.post('/addCountry', countries.addCountry);
//router.post('/removeCountry', countries.removeCountry);
router.get('/login', function handleAfricaPage(request, response) {
	response.render('login');
})
router.post('/editBorders', function handleAddDataPage(request, response){
	response.render('editBorders');
})






router.get('/countries', countries.findAll);
router.get('/countries/:continent', countries.findCountriesInContinent);
router.get('/quiz/:continent', countries.sendRandomCountries);
router.get('/background/:continent', countries.allButOneContinent);
router.get('/getCountryInfo', countries.getCountryInfo);
router.put('/update', countries.update);
router.get('/editCountry', function handleAddDataPage(request, response){
	response.render('editCountry');
})
router.post('/:continent', function handleAfricaPage(request, response) {
	var practice =false;
	console.log("Got the POST request " + request.params.continent);

	var courseID = request.body.custom_canvas_course_id;
	var assignmentID = request.body.custom_canvas_assignment_id;
	var userId = request.body.custom_canvas_user_id;

		response.render('index', {continent: request.params.continent,practice: practice, user: userId, assignment: assignmentID, course:courseID});
});




module.exports = router;
