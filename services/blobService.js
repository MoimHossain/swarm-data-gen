var azure = require('azure-storage');
var fs = require('fs');
var uuidv1 = require('uuid/v1');

var blobService = {
    getContainerName: function () {
        return "swarm-data";
    },
    getAccountName: function () {
        return process.env.STACC_NAME;
    },
    getAccountKey: function () {
        return process.env.STACC_KEY;        
    },
    getConnectionString: function () {
        return ('DefaultEndpointsProtocol=https;AccountName=' + blobService.getAccountName() + ';AccountKey=' + blobService.getAccountKey() + ';EndpointSuffix=core.windows.net');
    },

    writeJson: function (json, blobName, onComplete) {
        blobService.serviceCore
            .createBlockBlobFromText(
            blobService.getContainerName(), blobName, json, {},
            function (error, result, response) {
                if(error) {
                    console.log(error);
                } else {
                    onComplete(result);
                }
            });
    },
    configure: function (app, onComplete) {
        blobService.serviceCore = azure.createBlobService(blobService.getAccountName(), blobService.getAccountKey());
        blobService.serviceCore.createContainerIfNotExists(blobService.getContainerName(),
            function (error, result, response) {
                if (!error) {                    
                    onComplete();
                } else {
                    console.log(error);
                }
            });
    }
};

module.exports = blobService;

