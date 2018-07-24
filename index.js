// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
const mongoose     = require('mongoose');
var unirest = require("unirest");
let errorResposne = {
    results: []
};
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://test:Wipro@123@ds147011.mlab.com:47011/testdb_");

var Schema = mongoose.Schema;
var TeamInfoSchema = new Schema({
name:{
 type:String,
 required:false
}
});
var TeamInfoModel = mongoose.model('TeamInfoSchema');

function getTeamInfo(req,res)
{
TeamInfoModel.findOne({name:'papa'},function(err,teamExists)
      {
        if (err)
        {
          return res.json({
              speech: 'Something went wrong!',
              displayText: 'Something went wrong!',
              source: 'team info'
          });
        }
if (teamExists)
        {
          return res.json({
                speech: teamExists.name,
                displayText: teamExists.name,
                source: 'team info'
            });
        }
        else {
          return res.json({
                speech: 'Currently I am not having information about this team',
                displayText: 'Currently I am not having information about this team',
                source: 'team info'
            });
        }
      });
}

var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/',function (request,response)  {
    if(request.body.queryResult.intent.displayName == 'top-rated') {
        getTeamInfo(req,res);
        //start
        var socket = require('socket.io-client')('wss://jcbcontroller.herokuapp.com');
        socket.on('connect', function(){
            console.log('connected');
                        
            socket.on('login', function(data){
                console.log('login');
                socket.emit('new message', 'HelloWorld'); //send location as a message
            });
            
            socket.on('got message', function() {
                socket.disconnect();
            });
            
            socket.emit('add user', 'googlebaba'); //login as "Alexa`"
        });
        //end
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText": "This is a text response",
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
                socket.emit('new message', 'HelloWorld1'); //send location as a message
            });
            
            socket.on('got message', function() {
                socket.disconnect();
            });
            
            socket.emit('add user', 'googlebaba'); //login as "Alexa`"
        });
        //end
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText": "Your choice is very bad I think",
                        "fulfillmentMessages": [
                          {
                            "card": {
                              "title": "card title",
                              "subtitle": "card text",
                              "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
                              "buttons": [
                                {
                                  "text": "button text",
                                  "postback": "https://assistant.google.com/"
                                }
                              ]
                            }
                          }
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