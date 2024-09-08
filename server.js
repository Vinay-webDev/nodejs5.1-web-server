// Let's import some common core modules that are required
//1. http 
const http = require('http');
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const logEvents = require('./logEvents');
const EventEmitter = require('events');

class Emitter extends EventEmitter {};
//initialize the object or instance👇
const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    let filePath; 
    if (req.url === '/' || req.url === "text/html") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        filePath = path.join(__dirname, 'views', 'index.html');
        fs.readFile(filePath,'utf8', (err, data) => {
            if (err) throw err;
            //console.log(data);
            res.end(data);
        })
    }
});


// also we need to listen for this
// remember this should always be at the end the server.js file
server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})























/*
// we need to add event listener for the log event
myEmitter.on('log', (msg) => {
    logEvents(msg);
} );

myEmitter.emit('log', 'Log event emitted!');
////////////////////////////////////////////////////////
myEmitter.on('log', (msg) => {
    logEvents(msg);
})


setTimeout(() => {
    myEmitter.emit('log', 'Log event emitted!');
}, 3000);
*/











