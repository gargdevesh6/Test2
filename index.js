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
        //start - socketio
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'fruit'); //send location as a message
            });
            
            socket.on('got message', function() {
                socket.disconnect();
            });
            
            socket.emit('add user', 'googlebaba'); //login as "Alexa`"
        });
        //end

        //start - mongodb write
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
            //if (err) return console.log('conection_error');
            if (err) throw err;
            /*Return only the documents where the address starts with an "S":*/
            var db = client.db('testdb_');
            var item = { command: "fruit", userResponse: request.body.queryResult.parameters.Fruits };
            db.collection("called-intents").insertOne(item, function(err, result) {
              if (err) console.log('not_found');
              console.log('inserted');
              client.close();
            });
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
                
        //start
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'color'); //send location as a message
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
                
        //start
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'city'); //send location as a message
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