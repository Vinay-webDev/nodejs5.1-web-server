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
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;
// this function should always above server and below PORT
// notice that👉 here 'response' not just res ('res' which we use later to pass down response);
const serveFile = async (filePath, contentType, response) => {
    try {
        // need to have data from the files
        const rawData = await fsPromises.readFil(
            filePath, 
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json' 
                ? JSON.parse(rawData) : rawData
        // we still having 200 (which means sucessful) for 404 we need to change that for 404***
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            {'Content-Type': contentType}
        );
        response.end( contentType === 'application/json' 
                            ? JSON.stringify(data) : data
        );
        
    } catch(err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}\t${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}
// a better code and dynamic way of writing server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt'); // there's another parameter for where we need put in these logEvents 
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
        default:
            contentType = 'text/html';
    }
    //filePath ternary chain //don't assign filePath to a const (the app crashes) 
    let filePath = 
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
    if (!extension && req.url.slice(-1) !== '/') {filePath += '.html'};

    // now we need a way to server files 
    // before that we need to check for file exists or not
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        // server the file
        // we still need to call the serveFile 
        serveFile(filePath, contentType, res);
    } else {
        // 404
        // 301 redirect
        //console.log(path.parse(filePath));
        
        switch(path.parse(filePath).base) {
            case 'old-page.html':
                //res.writeHead(301, {'Content-Type':'/new-page.html'}); // use Location✅ not contentType ❌because it's a URL
                res.writeHead(301, {'Location':'/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                //res.writeHead(301, {'Content-Type':'/'}); // use Location✅ not contentType ❌because it's a URL
                res.writeHead(301, {'Location':'/'});
                res.end();
                break;
            default:
                //we need a function that works at both spots
                // we know exactly what file we need to serve here so 
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
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



////////////////////////////////////////////////////////
// we need to add event listener for the log event
myEmitter.on('log', (msg) => {
    logEvents(msg);
})


setTimeout(() => {
    myEmitter.emit('log', 'Log event emitted!');
}, 3000);
*/











