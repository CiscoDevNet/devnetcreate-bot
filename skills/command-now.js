//
// Command: now
//
module.exports = function (controller) {

    controller.hears(['now', 'current'], 'direct_message,direct_mention,mention', function (bot, message) {

        bot.reply(message, "_heard you! let's check what's happening now..._");

        fetchCurrent(function (err, activities, text) {
            if (err) {
                bot.reply(message, "*sorry, could not contact the organizers :-(*");
                return;
            }

            if (activities.length == 0) {
                bot.reply(message, text + "\n\nType "
                    + bot.enrichCommand(message, "next")
                    + " for upcoming activities");
                return;
            }

            // Store activities
            var toPersist = { "id": message.user, "activities": activities };
            controller.storage.users.save(toPersist, function (err, id) {
                bot.reply(message, text + "\n\nType "
                    + bot.enrichCommand(message, "about [number]")
                    + " for more details");
            });
        });
    });
}


/* 
 * Structure of an Activity
 *
  {
    "id": "day1-registration",
    "title": "Registration",
    "url": "https://devnetcreate.io/2017",
    "description": "Come to the Registration Desk and show your ID to collect your badge and conference materials. Grab a light breakfast and start connecting with your peers.",
    "day": "tuesday",
    "begin": "08:00AM",
    "end": "09:30AM",
    "beginDate": "2017-05-23T15:00:00.000Z",
    "endDate": "2017-05-23T16:30:00.000Z",
    "category": "others",
    "location": "Registration Desk",
    "location_url": "https://devnetcreate.io/2017",
    "speaker": "DevNet team",
    "speaker_url": "http://developer.cisco.com"
  }
 */
var debug = require("debug")("samples");
var fine = require("debug")("samples:fine");
var request = require("request");
function fetchCurrent(cb) {

    // Get list of current activities
    var options = {
        method: 'GET',
        url: "https://devnet-events-api.herokuapp.com/api/v1/events/current"
    };

    request(options, function (error, response, body) {
        if (error) {
            debug("could not retreive list of activities, error: " + error);
            cb(new Error("Could not retreive current activities, sorry [Live API not responding]"), null, null);
            return;
        }

        if ((response < 200) || (response > 299)) {
            console.log("could not retreive list of activities, response: " + response);
            sparkCallback(new Error("Could not retreive current activities, sorry [bad anwser from Live API]"), null, null);
            return;
        }

        var activities = JSON.parse(body);
        debug("fetched " + activities.length + " activities");
        fine(JSON.stringify(activities));

        if (activities.length == 0) {
            cb(null, activities, "**Found no activity going on currently.**");
            return;
        }

        var nb = activities.length;
        var msg = "**Activities happening now:**";
        for (var i = 0; i < nb; i++) {
            var current = activities[i];
            //msg += "\n:small_blue_diamond: "
            msg += "<br/> `" + (i + 1) + ")` ";
            msg += current.begin + " - " + current.end + ": " + current.title + " (" + current.location + ")";
        }

        cb(null, activities, msg);
    });
}