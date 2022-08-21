// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
//const functions = require('firebase-functions');
const express = require('express');
const fs = require('fs');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const os = require('os');
const { credential, database } = require('firebase-admin');

admin.initializeApp({credential: admin.credential.cert(__dirname+'/service.json'),
    databaseURL: "https://testproj-cef55-default-rtdb.firebaseio.com",
    storageBucket: "screenshots-p0pfx"
});

const ref = admin.storage().bucket();
const uuid = require("uuid-v4");
const { dirname } = require('path');
//const bodyParser = require("body-parser");
//const router = express.Router();
const app = express();
const port = process.env.PORT || 5000;

var def = admin.storage().bucket(`screenshots-p0pfx`);




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(os.tmpdir());


app.get('/',(req,res)=> {

    res.sendFile(__dirname+'/index.html');
});


app.get('/api/v4/callbackapi',(req,res)=>{

    const callbackId = req.query.callbackId;
    const callbackStatus = req.query.callbackStatus;
    const callbackResponse = req.body;

    console.log(callbackResponse);
    var rs = {callbackId,callbackStatus,callbackResponse};

    // var rs = {callbackId,callbackStatus,callbackResponse};
     var jsobj = JSON.stringify(callbackResponse);
     var clid = JSON.stringify(rs);
     console.log(jsobj);
     console.log(clid);

     fs.writeFile('output/'+callbackId+'.json',clid,'utf-8',function(err){
         if(err){
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
         }
         console.log("JSON file has been saved.");
         var path = callbackId+'.json';
         
         def.upload('output/'+callbackId+'.json',{
            public: true,
            destination: `mzuploads/${path}`,
            metadata: {
                cacheControl: "max-age=31536000",
                metadata: {
                    firebaseStorageDownloadTokens: uuid(), // Can technically be anything you want
                  },
            }
        });
        // console.log(def.getSignedUrl());
        
        
     });

    res.send({callbackId,callbackStatus,callbackResponse});

});




app.post('/api/v4/test',(req,res)=>{

    const callbackId = req.query.callbackId;
    const callbackStatus = req.query.callbackStatus;
    const callbackResponse = req.body;
    console.log(callbackResponse);
    var rs = {callbackId,callbackStatus,callbackResponse};

    // var rs = {callbackId,callbackStatus,callbackResponse};
     var jsobj = JSON.stringify(callbackResponse);
     var clid = JSON.stringify(rs);
     console.log(jsobj);
     console.log(clid);
     console.log(os.tmpdir());

     fs.writeFile(os.tmpdir()+'/'+callbackId+'.json',clid,'utf-8',function(err){
         if(err){
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
         }
         console.log("JSON file has been saved.");
         var path = callbackId+'.json';
         
         def.upload(os.tmpdir()+'/'+callbackId+'.json',{
            public: true,
            destination: `mzuploads/${path}`,
            metadata: {
                cacheControl: "max-age=31536000",
                metadata: {
                    firebaseStorageDownloadTokens: uuid(), // Can technically be anything you want
                  },
            }
        });
        // console.log(def.getSignedUrl());
        
        
     });

    res.send({
        'callbackId':callbackId,
        'callbackStatus':callbackStatus,
        'callbackResponse':callbackResponse
    });

});
app.listen(port);
exports.mzapi=functions.https.onRequest(app);









































