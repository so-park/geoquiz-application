# Geoquiz


## ABOUT
This project is originally developed for a political science professor to use for her teaching at SPU and is supported by ETM (Educational Technogloy and Media). 

The project contains codes for quiz and front end for managing database.
![image](/images/quiz-demo.gif)


## Before Running the application

* Clone Repository to your machine
```
$ git clone git@github.com:so-park/geoquiz-application.git
```
* Go to the repository and install npm to install all the dependencies.

```
$ npm install
```

## Initializing the database

There are two data files: for countries and users. 
countryDatabase.json stores information about countries of the world for the quiz, and userDatabase.json stores user information for accessing database page. 

Before running the application, make sure to create database using
```
$ node createdatabase.js
```

## Running the application

After installing npm and initializing the database, the command below will start the application.

```
$ node app.js
```
You should see the messages if the application starts running successfully.

![image](/images/nodeMessage.png)

In order to run the application permanently, install pm2 using
```
$ npm install pm2 -g 
```
Then use below command to run the application.
```
pm2 start app.js
```

## Front end for the database

When the app starts for the first time (/login), there is a default credential for admin. 
Use id: `etm` and password: `geoquiz2018` to access the page then add a new user. Make sure user name is admin to grant access to manage user page. If you don't want user to have access to manage user page, simply change user name to something else.
You can remove the default credentials afterwards. To keep your site secure you should modify the password of user `etm` or delete it completely. 

![image](/images/database-demo.gif "Database Demo")


## Canvas Integration 

When creating a server, it needs to be created on https in order to be integrated to Canvas.This application doesn't support redirection from http to https as it uses port 3443 as default. 

The application needs to be added as an application to Canvas. It also requires a token to send the grade back to Canvas, so the user must generate a token and make sure that it has permission to post grades. For more infomation on how to generate a token, visit https://community.canvaslms.com/docs/DOC-10806-4214724194. The token will be a combination of special characters, numbers, and letters. 
* Create a .env file in your project's directory (csProject/) to store the acquired token 
```
$ touch .env
```
* Write the below codes and change ... to the actual token acquired
```
TOKEN = ...
```
* Uncomment the top of the country.routes.js file between stars *.

![image](/images/token.png)

* Uncomment the sections router.post('/submission') and router.post('/quizStarted') in the file country.router.js. 
  The sections that need to be uncommented are between
```
******Canvas Integration*********
        [Block of codes]
********************************
```

* Change the url in the code accordingly. Substitue "canvas.spu.edu" to your institution's canvas page. 
```
https://canvas.spu.edu/api/v1/courses/ 
```

