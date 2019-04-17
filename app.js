const express    =   require('express');
const bodyParser =   require('body-parser');
const app        =   express();
const session  	 =   require('express-session')
const path       =   require('path');
//configuring the database
const dbConfig   =   { url: 'mongodb://localhost:27017/geoquiz'};
const mongoose   =   require('mongoose');
const compression=   require('compression')
// const https			 =	 require('https');
// const pm2   = require('pm2');
// const nodeMailer = require('nodemailer');
const port = 3000;
// require('dotenv').config();


// SSL Keys
// Setting up the credentials for the https server
// var fs = require('fs');
// var privateKey = fs.readFileSync('yaoshi/geo-quiz.me.key');
// var certificate = fs.readFileSync('yaoshi/geo-quiz.me.crt');
// var credentials = {key: privateKey, cert: certificate};
// *****************************************************************************

mongoose.Promise = global.Promise;

//connecting to the database
mongoose.connect(dbConfig.url, {useNewUrlParser: true})
	.then( function ConnectionHandler(){
		console.log("Connection successful");
	}).catch(function ExceptionHandler(err){
		console.log("Could not connect to Mongo");
		console.log(err);
		process.exit();
	});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
	secret: 'geoquiz',
	resave: false,
	saveUninitialized: true
}))

//check for new changes before sending the cached version
app.set('etag', false);

var router = require('./routes/country.routes.js');
app.use(compression());

// let transporter = nodeMailer.createTransport({
//             host: 'smtp.gmail.com',
// 						port: 465,
// 						secure: true,
// 						//tls: true,
//             auth: {
//                 user: 'spu.etmhelp@gmail.com',
//                 pass: 'Ames#2170'
//             }
//         });
//
//
// pm2.connect(function(err) {
// 	  if (err) {
// 			transporter.sendMail(mailOptions, function(error, info){
// 			    if(error){
// 			        return console.log(error);
// 			    }
// 			    console.log('Message sent: ' + info.response);
// 			});
// 		}
// 	  setTimeout(function worker() {
// 	    console.log("Restarting app...");
// 	    pm2.restart('app', function() {});
// 			transporter.sendMail(mailOptions, function(error, info){
// 					if(error){
// 							return console.log(error);
// 					}
// 					console.log('Message sent: ' + info.response);
// 			});
// 	    setTimeout(worker, 60000 * 60 *24 *7);
// 	  }, 60000 * 60 *24 *7);
// });
// app.use(function(req, res, next) {
//   req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/, '/$1.$2');
//   next();
// });
// app.use( function(req, res, next) {
// 	res.set('Cache-Control', 'no-cache');
//  next();
// });
// app.get('/*', function(req, res, next){
//   res.set('Last-Modified', (new Date()).toUTCString());
// 	console.log("entered last modified handler")
//   next();
// });
//serve static files in a folder and cache six months
// app.use('/', express.static(path.join(__dirname,'views'),{
// 				maxAge: 2592000*2, //about a month *2
// 				etag: false
// 			}));
app.use('/', router);
app.all('/:action', function(request, response) {});


  // Workers can share any TCP connection
  // In this case it is an HTTP server
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(3443);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.on('error', onError);
app.on('listening', onListening)
// httpsServer.on('error', onError);
// httpsServer.on('listening', onListeningS);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

	map = makeMap();
  console.log('Listening on ' + bind);
}

function onListeningS() {
  var addr = httpsServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
