

var url = require('url')
var fs = require('fs');
var express = require('express');
var app = express();
var Docker = require('dockerode');
var blobService = require('./services/blobService');

const docker = new Docker();

process.env.SERVER_PORT = (process.env.SERVER_PORT || 9012);
process.env.STACC_NAME = process.env.STACC_NAME || '';
process.env.STACC_KEY = process.env.STACC_KEY || '';

var jobs = [{
    fu: (onc) => docker.listTasks(onc),
    fileName: 'tasks'
},{
    fu: (onc) => docker.listServices(onc),    
    fileName: 'services'
},{
    fu: (onc) => docker.listNetworks(onc),    
    fileName: 'networks'
},{
    fu: (onc) => docker.listNodes(onc),    
    fileName: 'nodes'
}];



const runState = (state) => {
    if(state.cid >= jobs.length) {
        return;
    } else {
        var job = jobs[state.cid];
        state.cid = state.cid + 1;

        job.fu((error, dataCollection)=> {
            if(!error) {
                blobService.writeJson(JSON.stringify(dataCollection), job.fileName + ".json", (res) => {                
                    runState(state);
                });
            } else {
                runState(state);
            }
        });
    }
};

const repeatFunc = setInterval(() => {
    var stateObject = {
        cid: 0
    };
    runState(stateObject);
}, 8000);


app.get('/', function (req, res) {
    res.send("Hello from Docker Swarm Data Gen.");
});

var server = app.listen(process.env.SERVER_PORT, function () {
    blobService.configure(app, function () {
        console.log('Service is listening at port ' + process.env.SERVER_PORT + '!');
    });
});
