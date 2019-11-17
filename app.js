// Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var url = require("url");
var path = require("path");

// Create our Express application
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
//var router = express.Router();

var showRequest = false;
var showResponse = true;

var timeWaiting = 1000;

/*
Send Request.
*/
function sendResponse(fileName, req, res, status) {

    console.log("***JSON: " + fileName);
    console.log("***PARAMS: " + req.params);

    if (showRequest) {
        console.log("***Request.body:");
        console.log(req.body);
    }

    if (fs.existsSync(fileName)) {
        // Do something
        fs.readFile(fileName, 'utf8', function (err,data) {
            if (err) {
                console.log(err);
            } else {
                var obj = JSON.parse(data);
                res.header('Content-Type','application/json');

                if (showResponse) {
                    console.log("***Response: ");
                    console.log(obj);
                    console.log("***Status response:");
                    console.log(status);
                }
                res.status(status).json(obj);
            }
        });
    } else {
        console.log("not found");
        fs.readFile("error.json", 'utf8', function (err,data) {
            if (err) {
                console.log(err);
            } else {
                var obj = JSON.parse(data);
                res.header('Content-Type','application/json');
                res.status(status).json(obj);
            }
        });
    }
}
/*
Send PDF response.
*/
function sendPDFResponse(fileName, req, res, status) {

    console.log("PDF: " + fileName);

    fs.readFile(fileName, "binary", function(err, file) {

        if(err) {

            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err + "\n");
            res.end();
            return;
        }

        res.header('Content-Type','application/pdf');
        res.write(file, "binary");
        res.end();
    });
}


/*
Server configuration.
*/
// Start the server
app.listen(port);
console.log('cosmos API started at ' + port);


/*
Test GET hello
*/
app.get('/', function (req, res) {
    var status = 200;
    var fileName = "./JSONs/hello.json";
    sendResponse(fileName, req, res, status);
});

app.post('/', function (req, res) {
    var status = 200;
    var fileName = "./JSONs/hello.json";
    if (req.body.name && typeof req.body.name !== 'undefined') {

    } else {
        status = 400;
        fileName = "./JSONs/requestError.json";
    }
    sendResponse(fileName, req, res, status);
});

app.put('/', function (req, res) {
    var status = 200;
    var fileName = "./JSONs/hello.json";
    sendResponse(fileName, req, res, status);
});

app.delete('/', function (req, res) {
    var status = 200;
    var fileName = "./JSONs/hello.json";
    sendResponse(fileName, req, res, status);
});



