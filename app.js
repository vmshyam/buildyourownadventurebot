var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var twilio = require('twilio');

var oConnections = {};

// Define the port to run on
app.set('port', process.env.PORT || parseInt(process.argv.pop()) || 5100);

// Define the Document Root path
var sPath = path.join(__dirname, '.');

app.use(express.static(sPath));
app.use(bodyParser.urlencoded({ extended: true }));

function fPlay(req, res) {
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if (sAction.toLowerCase().search("yes") != -1){
    twiml.message("Oh glory. Here it is. I got it for you. Do you throw it again?");
  }else if(sAction.toLowerCase().search("no") != -1){
    twiml.message("Oh well. Wait .... Over there is that a stick or a fire hydrant?");
    oConnections[sFrom].fCurState = fStickOrHydrant;
  }else{
    twiml.message("Wow! I've never seen you do " + sAction + " before. Wait .... Over there is that a stick or a fire hydrant?")
    oConnections[sFrom].fCurState = fStickOrHydrant;
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fStick(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("eat") != -1){
    oConnections[sFrom].fCurState = fStickOrHydrant;
    twiml.message("Yum! Sticks are the best thing ever lot's of roughage. Wait .... Over there is that a stick or a fire hydrant?");
  }else if(sAction.toLowerCase().search("take") != -1){
    twiml.message("Please play with me. Do you throw the stick?");
    oConnections[sFrom].fCurState = fPlay;
  }else{
    twiml.message("Wow! I've never done " + sAction + " before. Wait .... Over there is that a stick or a fire hydrant?")
    oConnections[sFrom].fCurState = fStickOrHydrant;
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fStickOrHydrant(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("stick") != -1){
    twiml.message("I love sticks.... Should I eat it or take it to my person so he will throw it?");
    oConnections[sFrom].fCurState = fStick;
  }else if(sAction.toLowerCase().search("hydrant") != -1){
    twiml.message("Pee mail! How exciting. Wait .... Over there is that a stick or a fire hydrant?");
  }else {
    twiml.message("Wow! I've never seen " + sAction + " before. Wait .... Over there is that a stick or a fire hydrant?")
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

//Starting of the game
function fBeginning(req, res)
{
  var sFrom = req.body.From;
  oConnections[sFrom].fCurState = fStickOrHydrant;
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('Welcome to the "The Cave" --> As you walk through the wooded forest, ' +
  'you see the entrance to the Cave. You step closer to the entrance and a cold wind blows past your face and sends a cold shiver down your spine.' +
  'When you get into the cave it suddenly goes dark but you can see a dim light of a lantern coming from the depths of the cave. ' +
  'You hear a scream you turn to run out of the cave but you run straight in to a wall you are trapped and your only way out is to go deeper into the cave.' +
  'You started to walk into the dark depths of the cave. You hear a scream, you stand your ground as something brushes past you. Do you want to Swing or dash to the lantern?');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());

}

//define a method for the twilio webhook
app.post('/sms', function(req, res) {
  var sFrom = req.body.From;
  if(!oConnections.hasOwnProperty(sFrom)){
    oConnections[sFrom] = {"fCurState":fBeginning};
  }
  oConnections[sFrom].fCurState(req, res);
});

// Listen for requests
var server = app.listen(app.get('port'), () =>{
  var port = server.address().port;
  console.log('Listening on localhost:' + port);
  console.log("Document Root is " + sPath);
});
