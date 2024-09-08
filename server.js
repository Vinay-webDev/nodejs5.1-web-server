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

// a better code and dynamic way of writing server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.html':
            contentType = 'text/html';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        default:
            contentType = 'text/html';
    }
    //filePath ternary chain
    const filePath = 
            contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'//subdirectory***
                ?path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ?path.join(__dirname, 'views', req.url)
                    :path.join(__dirname, req.url);

    // need to check any page request that are without .html extension then need to add .html to it
    // not required in browser because browser adds .html by default
    // makes .html extension 
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    // now we need a way to server files 
    // before that we need to check for file exists or not
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        // server the file
    } else {
        // 404
        // 301 redirect
    }
})
// also we need to listen for this

server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})
// 👉👉👉remember this should always be at the end the server.js file👈👈👈



/////////////////////////////////////////////////////////////
/*
//1.
const serverOne = http.createServer((req, res) => {
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
*/
/* 
//2.
// the app crashed here const
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    switch(req.url) {
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            path = path.join(__dirname, 'views', 'index.html');
            fs.readFile(path, 'utf8', (err, data) => {
                res.end(data);
            })
            break;
    }
})
*/




















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











