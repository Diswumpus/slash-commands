const http = require('http'); // to create server
const url = require('url'); // to parse url
const https = require('https');// to send https requests 
const client = require('../s-index').client; //Get discord client

var dismap = new Map();// for simplicity using has map to store ip details instead of db

// create basic server and implement handling different requests
const app = http.createServer(async (req, res) => {
    // parse the incoming url
    const parsedURL = url.parse(req.url, true);
    if(parsedURL.pathname.startsWith('/api/client') && req.method === 'GET') {
        res.setHeader('content-type', 'Application/json');
        res.end(JSON.stringify(client))
        return client
} else if(parsedURL.pathname.startsWith('/api/status') && req.method === 'GET'){
    res.end(JSON.stringify(client.user.presence))
}
else if(parsedURL.pathname.startsWith('/api/stats') && req.method === 'GET'){
    let re = {
        "guilds": client.guilds.cache.size,
        "users": client.users.cache.size
    }
    res.end(JSON.stringify(re));
}
});//End of create server.

app.listen(4000);