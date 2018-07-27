// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://test:Wipro123@ds147011.mlab.com:47011/testdb_";
var unirest = require("unirest");
let errorResposne = {
    results: []
};

var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/',function (request,response)  {
    if(request.body.queryResult.intent.displayName == 'favorite fruit') {
        var response = request.body.queryResult.parameters.Fruits;

        //start - mongodb write
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            //if (err) return console.log('conection_error');
            if (err) throw err;
            /*Return only the documents where the address starts with an "S":*/
            var db = client.db('testdb_');
            var item = { command: "fruit", userResponse: response };
            db.collection("called-intents").insertOne(item, function(err, result) {
              if (err) console.log('not_found');
              console.log('inserted');
              client.close();
            });
          }); 
        //end

 
        //start - socketio
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'fruit-'+response); //send location as a message
            });
            
            socket.on('got message', function() {
                socket.disconnect();
            });
            
            socket.emit('add user', 'googlebaba'); //login as "Alexa`"
        });
        //end

        response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({
                "fulfillmentText": "What's your favorite city?",
                "fulfillmentMessages": [
                ]
                }
              )); 
                    
    } else if(request.body.queryResult.intent.displayName == 'favorite color') {
        var response = request.body.queryResult.parameters.sys.color;

        //start - mongodb write
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            //if (err) return console.log('conection_error');
            if (err) throw err;
            /*Return only the documents where the address starts with an "S":*/
            var db = client.db('testdb_');
            var item = { command: "color", userResponse: response };
            db.collection("called-intents").insertOne(item, function(err, result) {
              if (err) console.log('not_found');
              console.log('inserted');
              client.close();
            });
          }); 
        //end

    

        //start
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'color-'+response); //send location as a message
            });
            
            socket.on('got message', function() {
                socket.disconnect();
            });
            
            socket.emit('add user', 'googlebaba'); //login as "Alexa`"
        });
        //end

       
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText": "What is your favorite fruit?",
                        "fulfillmentMessages": [
                        ]
                        }
                      )); 
    }  else if(request.body.queryResult.intent.displayName == 'favorite city') {
        var response = request.body.queryResult.parameters.Cities;
        var talkback = [];
        var talkback_resp = '';

        //start - mongodb write
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            //if (err) return console.log('conection_error');
            if (err) throw err;
            /*Return only the documents where the address starts with an "S":*/
            var db = client.db('testdb_');
            var item = { command: "city", userResponse: response };
            db.collection("called-intents").insertOne(item, function(err, result) {
              if (err) console.log('not_found');
              console.log('inserted');
              client.close();
            });
          }); 
        //end

        

       //start - mongodb read
       MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        //if (err) return console.log('conection_error');
        if (err) throw err;
        /*Return only the documents where the address starts with an "S":*/
        var db = client.db('testdb_');
        //var query = { name: "Dada" };
        db.collection("called-intents").find().sort({_id:-1}).limit(4).toArray(function(err, result) {
          if (err) console.log('not_found');
          talkback = result;
          console.log(result);
          client.close();
        });
      }); 
    //end

//start - talkback response build
if(talkback[3].command == 'welcome')
{
    talkback_resp += 'Imagine a perfect day where you are wearing a ' + talkback[2].userResponse +
     ' shirt, eating ' + talkback[1].userResponse + ' and enjoying the weather of ' + talkback[0].userResponse;
}
else
    talkback_resp = 'Sorry the statement cannot be build';
//end

        //start
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'city-'+ response); //send location as a message
            });
            
            socket.on('got message', function() {
                socket.disconnect();
            });
            
            socket.emit('add user', 'googlebaba'); //login as "googlebaba`"
        });
        //end

                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText": talkback_resp,
                        "fulfillmentMessages": [
                        ]
                        }
                      )); 
    } else if(request.body.queryResult.intent.displayName == 'Default Welcome Intent') {
    
        //start - mongodb write
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            //if (err) return console.log('conection_error');
            if (err) throw err;
            /*Return only the documents where the address starts with an "S":*/
            var db = client.db('testdb_');
            var item = { command: "welcome"};
            db.collection("called-intents").insertOne(item, function(err, result) {
              if (err) console.log('not_found');
              console.log('inserted');
              client.close();
            });
          }); 
        //end

        //start
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'welcome'); //send location as a message
            });
            
            socket.on('got message', function() {
                socket.disconnect();
            });
            
            socket.emit('add user', 'googlebaba'); //login as "googlebaba`"
        });
        //end

                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText": "What is your favorite color?",
                        "fulfillmentMessages": [
                        ]
                        }
                      )); 
    } else if(request.body.queryResult.intent.displayName == 'End') {
    
        //start - mongodb write
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            //if (err) return console.log('conection_error');
            if (err) throw err;
            /*Return only the documents where the address starts with an "S":*/
            var db = client.db('testdb_');
            var item = { command: "end"};
            db.collection("called-intents").insertOne(item, function(err, result) {
              if (err) console.log('not_found');
              console.log('inserted');
              client.close();
            });
          }); 
        //end

        //start
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'end'); //send location as a message
            });
            
            socket.on('got message', function() {
                socket.disconnect();
            });
            
            socket.emit('add user', 'googlebaba'); //login as "googlebaba`"
        });
        //end

                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText": "Thank you for trying our application. Have a great day ahead.",
                        "fulfillmentMessages": [
                        ]
                        }
                      )); 
    }
});
server.get('/getName',function (req,res){
    res.send('Devesh Garg');
});
server.get('/',function (req,res){
    res.send('Welcome to the application');
});
server.listen(port, function () {
    console.log("Server is up and running...");
});
