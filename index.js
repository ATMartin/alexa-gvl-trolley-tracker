var http = require('http');
var AlexaSkill = require('./AlexaSkill');
var APP_ID = undefined;

var TROLLEYS_URL = "http://api.yeahthattrolley.com/api/v1/Trolleys/Running";
var ROUTES_URL = "http://api.yeahthattrolley.com/api/v1/Routes/Active";

var TrolleyHelper = function() {
  AlexaSkill.call(this, APP_ID);
}

TrolleyHelper.prototype = Object.create(AlexaSkill.prototype);
TrolleyHelper.prototype.constructor = TrolleyHelper;

var getData = function(url, callback, response) {
  http.get(url, function(res) {
    var body = '';
    res.on('data', function(d) { body += d; });
    res.on('end', function() { callback(JSON.parse(body), response); });
  }).on('error', function() {
    console.log(e);
  });
}

var respondWithRoutes = function(routes, response) {
    var speechOutput = "",
        repromptOutput = "Would you like to know more?";

    if (routes.length) {
      speechOutput = "There are currently " + routes.length + " active routes.";
    } else {
      speechOutput = "There are no active trollies at this time. Would you like to know more?"
    }
    response.ask(speechOutput, repromptOutput);
}

var intentGoodbye = function() {
  response.tell("Goodbye!");
}

TrolleyHelper.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  var help_prompt = "Welcome to the Greenville Trolley Tracker! You can ask for 'Active Routes' to learn what's running today.";
  var reprompt = "Say 'Active Routes' for more info.";

  response.ask(help_prompt, reprompt);
}

TrolleyHelper.prototype.intentHandlers = {
  "GetActiveRoutesIntent": function(intent, session, response) {
    getData(ROUTES_URL, respondWithRoutes, response);
  },

  "GetRouteInfoIntent": function(intent, session, response) {
    var speechOutput = "You asked for info about the " + intent.slots.identifier + " route!",
        repromptOutput = "Would you like to know more?";

    response.ask(speechOutput, repromptOutput);
  },

  "HelpIntent": function(intent, session, response) { intentGoodbye(); },

  "StopIntent": function(intent, session, response) { intentGoodbye(); },

  "CancelIntent": function(intent, session, response) { intentGoodbye(); }
}

exports.handler = function(event, context) {
  var skill = new TrolleyHelper();
  skill.execute(event, context);
}
