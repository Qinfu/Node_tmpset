var https = require('https');
const express = require('express')
var fs = require('fs');
var options = {
    // Specify the key file for the server
    key: fs.readFileSync('./server-key.pem'),
    // Specify the certificate file
    cert: fs.readFileSync('./server-crt.pem'),
    // Specify the Certificate Authority certificate
    ca: fs.readFileSync('./ca-crt.pem'),
    // Requesting the client to provide a certificate, to authenticate the user.
    requestCert: true,
    // As specified as "true", so no unauthenticated traffic
    // will make it to the specified route specified
    rejectUnauthorized: false
};

var app = express();
app.use(function (req, res, next) {
    if (!req.client.authorized) {
        //return res.status(401).send('Client cert failed. User is not authorized\n');
    }
    // Examine the cert itself, and even validate based on that!
    var cert = req.socket.getPeerCertificate();
    if (cert.subject) {
        console.log('Client Certificate: ',cert);
        console.log('Client Certificate Common Name: '+cert.subject.CN);
        console.log('Client Certificate Location: '+cert.subject.L);
        console.log('Client Certificate Organization Name: '+cert.subject.O);
        console.log('Client Certificate Email Address: '+cert.subject.emailAddress);
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("hello world from client cert\n");
    next();
});

var listener = https.createServer(options, app).listen(4433, function () {
    console.log('Express HTTPS server listening on port ' + listener.address().port);
});