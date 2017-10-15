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

function fDoorOrFind(req, res) {
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if (sAction.toLowerCase().search("door") != -1){
    twiml.message("As you walk through the door, you feel something pull you into the Cave. You are dragged deep in the dark eerie Cave. You are unable to move and can not feel your body. " +
    "You hear screams all around you as a dark shadow approaches you. Your eyes start to close and you start to grasp for air." +
    "And the last sound you hear is ‘NEVER ENTER A UNKNOW CAVE. IT MIGHT BE YOUR LAST!!’");
  }else if(sAction.toLowerCase().search("find") != -1){
    twiml.message("As you walk through the endless Cave, you feel tired and hopeless trying to find a way out. You are hunger and dehydrated. You keep asking yourself, ‘Why did I enter this Cave?’ " +
    "Suddenly, you hear a scream, you stand your ground as something brushes past you. Than you think to yourself, ‘Have I been here before?’" + 
    "Than you hear a whisper, ‘NEVER ENTER A UNKNOW CAVE. IT MIGHT BE YOUR LAST!! HAHA’");
  }else{
    twiml.message("HURRY!!, You have to make a decision now, do you want to go through the DOOR or try to FIND away out?");
    oConnections[sFrom].fCurState = fDoorOrFind;
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fBridgeOrRiver(req, res) {
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if (sAction.toLowerCase().search("bridge") != -1){
    twiml.message("As you walk over the old wooden bridge, the bridge starts to sway back and forth. Suddenly the bridge breaks and you fall." +
    "As you fall, you see the awaken Dragon. You fall right into the Dragon’s mouth and are eaten alive by the Dragon." +
    "NEVER ENTER A UNKNOW CAVE. IT MIGHT BE YOUR LAST!!");
  }else if(sAction.toLowerCase().search("river") != -1){
    twiml.message("As you float on the boulder down the river away from the Dragon, you feel a sense of relief. But suddenly the river starts to flow faster." +
    "It is hard for you to stay on the boulder as you struggle for grip. Suddenly you slip and fall of the boulder into the raging river. The river holds you down and you struggle to breath. You are taken by the raging river, and you drown." +
    "NEVER ENTER A UNKNOW CAVE. IT MIGHT BE YOUR LAST!!");
  }else{
    twiml.message("HURRY!!, You have to make a decision now, do you want to cross the Dragon by creeping over the Wooden BRIDGE or you decide to flow on the BOULDER away from the Dragon?");
    oConnections[sFrom].fCurState = fBridgeOrRiver;
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fWithOrWithGold(req, res) {
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if (sAction.toLowerCase().search("without") != -1){
    twiml.message("As the Cave gets darker, you run out of the Cave as fast as you can. You keep running without stopping looking of a way out. " +
    "You hear eerie noises and see shadow figures. You suddenly see a door. Do you want to go through the DOOOR or keep trying to FIND a way out of the Cave?");
    oConnections[sFrom].fCurState = fDoorOrFind;
  }else if(sAction.toLowerCase().search("with") != -1){
    twiml.message("As the Cave gets darker, you grab a Golden Bar. Than as you run out the Cave, the Cave suddenly collapses and you are crushed to death by the debris. " +
    "NEVER ENTER A UNKNOW CAVE. IT MIGHT BE YOUR LAST!!");
  }else{
    twiml.message("HURRY!!, You have to make a decision now, do you want to run WITHOUT taking the Gold or run WITH taking the Gold?");
    oConnections[sFrom].fCurState = fWithOrWithGold;
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fLeftOrRightCave(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("left") != -1){
    twiml.message("You enter the left Cave which has a golden light shinning within. As you walk into the Cave you see Gold. You see Gold everywhere around you. " +
    "But suddenly the Cave started to get dark slowing. You want to run out, but should you run out WITH the gold or WITHOUT the gold?");
    oConnections[sFrom].fCurState = fWithOrWithGold;
  }else if(sAction.toLowerCase().search("right") != -1){
    twiml.message("You walk into the cave unaware of what is ahead. You notice, underneath you feet there are squeaks of rats eating dead bodies. You look back and the entrance you came through has disappeared. " +
    "As you look around and you see a sleeping Dragon. This is the cave of a Dragon. As you nervously panic, you see a wooden bridge crossing over the sleep Dragon to another Cave entrance. You also see river, flowing always from the dragon" +
    "Do you want to creep over the wooden BRIDGE or flow on a boulder in the RIVER?");
    oConnections[sFrom].fCurState = fBridgeOrRiver;
  }else{
    twiml.message("HURRY!!, You have to make a decision now, do you want go through the Cave on the LEFT with the shinning golden light or the Cave on right which feels somewhat warmer?");
    oConnections[sFrom].fCurState = fLeftOrRightCave;
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

function fSwingOrDash(req, res){
  var sFrom = req.body.From;
  var sAction = req.body.Body;
  var twiml = new twilio.twiml.MessagingResponse();
  if(sAction.toLowerCase().search("swing") != -1){
    twiml.message("You swing your sword out in front of you and you hit the dark shadowed beast. Blood squirts out of the body of the beast and the beast falls to the ground. " +
    "The figure of the beast quickly disappears from the ground. As you look around in distress, you see a light shining through a small slit in the wall. " +
    "You move forward and squeeze through slit, as you discover two Caves. Which Cave do you want to go into, LEFT or RIGHT?");
    oConnections[sFrom].fCurState = fLeftOrRightCave;
  }else if(sAction.toLowerCase().search("dash") != -1){
    twiml.message("You run towards the lantern and accidently slip and knock over the lantern. The oil spills over you and you catch on file. You try to put the fire out but it is too late. You are burned alive." +
    " NEVER ENTER A UNKNOW CAVE. IT MIGHT BE YOUR LAST!!");
  }else {
    twiml.message("HURRY!!, You have to make a decision now, do you want to SWING you sword desperately or DASH to the Lantern");
    oConnections[sFrom].fCurState = fSwingOrDash;
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
}

//Starting of the game
function fBeginning(req, res)
{
  var sFrom = req.body.From;
  oConnections[sFrom].fCurState = fSwingOrDash;
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('Welcome to the "The Cave" --> As you walk through the wooded forest, ' +
  'you see the entrance to the Cave. You step closer to the entrance and a cold wind blows past your face and sends a cold shiver down your spine.' +
  'When you get into the cave it suddenly goes dark but you can see a dim light of a lantern coming from the depths of the cave. ' +
  'You hear a scream you turn to run out of the cave but you run straight in to a wall you are trapped and your only way out is to go deeper into the cave.' +
  'You started to walk into the dark depths of the cave. You hear a scream, you stand your ground as something brushes past you. Do you want to SWING your sword desperately or DASH to the lantern?');
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
