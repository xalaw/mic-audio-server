
const path = require('path');
const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const upload = multer({ dest: './audioupload'});
const fs = require('fs');

// API endpoints go here!
app.use(express.static('public'));
app.use(express.static('audioupload'));

app.use(bodyParser.raw({ type: 'audio/ogg', limit: '50mb' }));

app.post('/audioupload', upload.single(), function(req, res, next) {
    try{
    console.log('body => ', req.body);
    console.log('files => ', req.files);
    const audioFile = req.file;
    //create unique filenames
    let d = new Date();
    let n = d.getTime();
    let newFilename = n+'.ogg'
    //write file
    fs.writeFile(newFilename, req.body, function(err){
        if(err) {
            console.log('Error in writing file: ', err);
        }
    })
    res.send();
    }
    catch(e){
    console.log(e);
    res.sendStatus(400);
    }
    next();
});
// Serve the built client

app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port=3001) {
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            resolve();
        }).on('error', reject);
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
