// Dependencies
var Got        = require('got'),
    AlexaSkill = require('./AlexaSkill');

// Utility Variables
var APP_ID = undefined;

// Remote Endpoints
var URL_TROLLEYS      = "http://api.yeahthattrolley.com/api/v1/Trolleys/Running",
    URL_ACTIVE_ROUTES = "http://api.yeahthattrolley.com/api/v1/Routes/Active",
    URL_ALL_ROUTES    = "http://api.yeahthattrolley.com/api/v1/Routes";

// Common Strings
var PROMPT_MORE_INFO = "Would you like to know more?";

// Utility Methods
var buildRoutesList = function(routes) {
  var routeList = "";
  routes.forEach(function(route) {
    if (routes.indexOf(route) == routes.length - 1) {
      routeList += ", and " + route["LongName"];
    } else {
      routeList += route["LongName"] + ", ";
    }
  });
  return routeList;
}

var intentGoodbye = function() {
  response.tell("Goodbye!");
}

var sanitizeShortName = function(name) {
  return name
          .replace(/[\/+-]/g, '')
          .replace(/\s{2,}/g, ' ')
          .replace(/\sst(\s|\.|$)/gi, " street$1")
          .toLowerCase();
}

// App Setup
var TrolleyHelper = function() {
  AlexaSkill.call(this, APP_ID);
}

TrolleyHelper.prototype = Object.create(AlexaSkill.prototype);
TrolleyHelper.prototype.constructor = TrolleyHelper;

// Initializer & Default Landing
TrolleyHelper.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  var help_prompt = "Welcome to the Greenville Trolley Tracker! You can ask for 'Active Routes' to learn what's running today, and then ask for more info about a particular route.";
  var reprompt = "Say 'What routes are active?' for more info.";
  response.ask(help_prompt, reprompt);
}

// Intents
TrolleyHelper.prototype.intentHandlers = {
  "GetActiveRoutesIntent": function(intent, session, response) {
    var speechOutput = "";

    Got(URL_ACTIVE_ROUTES)
      .then(function(result) {
        var routes = JSON.parse(result.body);

        if (routes.length >= 1) {
          var plural = routes.length > 1;
          speechOutput = "There " + (plural ? "are" : "is") + " currently " + routes.length + " active route" + (plural ? "s" : "") + ": " + buildRoutesList(routes) + ".";
          response.ask(speechOutput, PROMPT_MORE_INFO);
        } else {
          speechOutput = "There are no active trollies at this time.";
          response.tell(speechOutput);
        }
      });
  },

  "GetRouteInfoIntent": function(intent, session, response) {
    var identifier = intent.slots.identifier.value.toLowerCase();

    Got(URL_ALL_ROUTES)
      .then(function(result) {
        var routes = JSON.parse(result.body),
            matched = false;

        for(var i = 0; i < routes.length; i++) {
          var cleanName = sanitizeShortName(routes[i]["LongName"]);
          if (cleanName == identifier) {
            response.ask(routes[i]["Description"], PROMPT_MORE_INFO);
            matched = true;
          }
        }
        if (!matched) {
          response.ask("Sorry, we didn't find a match for that route.", PROMPT_MORE_INFO);
        }
      });
  },

  "HelpIntent": function(intent, session, response) { intentGoodbye(); },

  "StopIntent": function(intent, session, response) { intentGoodbye(); },

  "CancelIntent": function(intent, session, response) { intentGoodbye(); }
}

// Handle & setup
exports.handler = function(event, context) {
  var skill = new TrolleyHelper();
  skill.execute(event, context);
}
