module.exports = exports = exports.default = (_path, _port, _hostName) => {

    _port = _port || process.env.PORT || 8085;
    
    _port = parseInt(_port, 10);
    
    const http = require('http');
    http.globalAgent.maxSockets = Infinity;
    const fs = require('fs');
    const path = require('path');
    http.createServer(function (req, res) {
    console.log('req:',req.method, ':',  req.url);
    let filePath = _path + req.url;
    if (req.url == '/')
     filePath = _path + '/index.html';
    const extname = String(path.extname(filePath)).toLowerCase();
    let contentType = 'text/html';
    const mimeTypes = {
     '.html': 'text/html',
     '.js': 'text/javascript',
     '.css': 'text/css',
     '.json': 'application/json',
     '.png': 'image/png',
     '.jpg': 'image/jpg',
     '.gif': 'image/gif',
     '.wav': 'audio/wav',
     '.mp4': 'video/mp4',
     '.woff': 'application/font-woff',
     '.ttf': 'applilcation/font-ttf',
     '.eot': 'application/vnd.ms-fontobject',
     '.otf': 'application/font-otf',
     '.zip': 'application/zip',
     '.svg': 'application/image/svg+xml'
    };
    contentType = mimeTypes[extname] || 'application/octect-stream';
    fs.readFile(filePath, function(error, content) {
     if (error) {
     if(error.code == 'ENOENT'){
      filePath = _path + '/index.html';
     res.writeHead(200, {
         'Content-Type': 'text/html',
         'Access-Control-Allow-Origin': '*'
        });
     res.write(Buffer.from(fs.readFileSync(filePath)));
     res.end()
     }
     else {
     res.writeHead(500, {
        'Access-Control-Allow-Origin': '*'
     });
     res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
     }
     }
     else {
     res.writeHead(200, {
         'Content-Type': contentType,
         'Access-Control-Allow-Origin': '*'
        });
     res.write(content, 'utf-8');
     res.end();
     }
    });
    }).listen(_port, _hostName, () => console.log(`Local server: Running at http://${_hostName}:${_port}/`));
    
    return _port;
    
    };