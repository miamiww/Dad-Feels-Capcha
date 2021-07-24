const express = require('express');
const app = express();
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const server = app.listen(8787);
const { Server } = require("socket.io");
const io = new Server(server); 

const nodemailer = require('nodemailer');
var config = require('./email_config.js');

// async..await is not allowed in global scope, must use a wrapper
async function maildaemon(feel) {
  console.log('sending email')
  let recipients = 'rivendalejones@gmail.com';
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'yahoo', // no need to set host or port etc.
    auth: {
      user: config.user, 
      pass: config.password
    }
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
      from: '"DadFeels 👻" <typochat@yahoo.com>', // sender address
      to: recipients, // list of receivers
      subject: 'new dad feel', // Subject line
      text: feel, // plain text body
      html: '<b>'+feel+'</b>' // html body
  });
}

/* email end */

io.on('feeling', function(msg) {
	console.log(msg);
})
app.use(express.json());
app.use(express.urlencoded());

app.use(express.static('public'));

app.get("/", function (request, response) {
	  response.sendFile(__dirname + '/views/index.html');
});


app.post("/sendtext/", async function(request, response){
	// console.log(request)
	console.log(JSON.stringify(request.body))
    const textBody = JSON.stringify(request.body);
	maildaemon(textBody).catch(console.error);
	response.json("recieved");
});

app.get('/approve/', function(request, response){
	response.send('approve')
	io.emit('verification', {message:'approved'});
})

app.get('/deny/', function(request, response){
	response.send('deny')
	io.emit('verification', {message:'denied'});	
})




