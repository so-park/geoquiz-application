# Geoquiz


## ABOUT
This project is originally developed for a political science professor to use for her teaching at SPU and is supported by ETM (Educational Technogloy and Media). 

The project contains codes for quiz and front end for managing database. The live quiz is hosted in digital ocean and integrated to Canvas, however, users will need to configure those settings separately. 


/ Need to include screenshots
![alt text](../images/selectScreen.png)
![alt text](../images/quiz.png)
![alt text](../images/result.png)


## Prerequisites 

Install node.js and npm. 
Make sure all the dependencies below are properly installed before running the application.

```
    "bcrypt": "^3.0.6",
    "compression": "^1.7.4",
    "dotenv": "^7.0.0",
    "ejs": "^2.6.1",
    "express": "^4.16.4",
    "express-session": "^1.16.1",
    "formidable": "^1.2.1",
    "mongo": "^0.1.0",
    "mongoose": "^5.4.20",
    "request": "^2.88.0"
```
## Initializing the database

There are two data files: for countries and users. 
countryDatabase.json stores information about countries of the world for the quiz, and userDatabase.json stores user information for accessing database page. 

Before running the application, make sure to create database using
```
node createdatabase.js
```

## Running the application

```
node app.js
```
In order to run the application permanently, use pm2. Make sure to uncomment the codes to use pm2. 

```
pm2 start app.js
```

## Front end for the database

When the app starts for the first time (/login), there is default credentials for admin. 
Use id: etm and password: geoquiz2018 to access the page then add a new user. Make sure user name is admin to grant access to manage user page. If you don't want user to have access to manage user page, simply change user name to something else.
You can remove the default credentials afterwards. 

!(image)[../images/database-demo.gif]


