//
// Command: next
//
module.exports = function (controller) {

    controller.hears(['^next\s*(.*)', '^upcoming\s*(.*)'], 'direct_message,direct_mention,mention', function (bot, message) {

        // Check conference is not over
        var now = Date.now();
        var ends = new Date("2017-05-25T01:00:00.000Z").valueOf(); // May 24th 6PM PFT
        if ((now - ends) > 0) {
            bot.reply(message, "**DevNetCreate 2017 is now over!**\n\nCheck the [videos](https://devnetcreate.io/2017/pages/livestream/livestream.html) and [Twitter](https://twitter.com/DevNetCreate) for latest info");
            return;
        }
        
        // Let's look for upcoming activities
        bot.reply(message, "_heard you! let's check what's coming..._");
        var limit = parseInt(message.match[1]);
        if (!limit) limit = 9;
        if (limit < 1) limit = 1;

        fetchNext(limit, function (err, activities, text) {
            if (err) {
                bot.reply(message, "**sorry, ball seems broken  :-(**");
                return;
            }

            // Store activities
            var toPersist = { "id": message.user, "activities": activities };
            controller.storage.users.save(toPersist, function (err, id) {
                if (err) {
                    bot.reply(message, text + "\n\nI am not feeling well, please retry later...");
                    return;
                }

                if (activities.length === 0) {
                    bot.reply(message, text);
                    return;
                }

                bot.reply(message, text + "\n\nType " + bot.enrichCommand(message, "about [number]") + " for more details. For example: " + bot.enrichCommand(message, "about 1"));
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
function fetchNext(limit, cb) {

    // Get list of upcoming events
    var options = {
        method: 'GET',
        url: "https://devnetcreate-api.herokuapp.com/api/v1/activities/next?limit=" + limit
    };
    request(options, function (error, response, body) {
        if (error) {
            debug("could not retreive list of activities, error: " + error);
            cb(new Error("Could not retreive upcoming activities, sorry [Live API not responding]"), null, null);
            return;
        }

        if ((response < 200) || (response > 299)) {
            console.log("could not retreive list of activities, response: " + response);
            sparkCallback(new Error("Could not retreive upcoming events, sorry [bad anwser from Live API]"), null, null);
            return;
        }

        var activities = JSON.parse(body);
        debug("fetched " + activities.length + " events");
        fine(JSON.stringify(activities));

        if (activities.length == 0) {
            cb(null, activities, "**Guess what? No upcoming activity!**");
            return;
        }

        var nb = activities.length;
        var msg = "Here are the next " + nb + " activities:\n";
        for (var i = 0; i < nb; i++) {
            var current = activities[i];
            
            // Turned from Slack to Cisco Spark formatting
            //msg += "\n:small_blue_diamond: "
            msg += "<br/> `" + (i+1) + ")` ";

            // Do not emphasize workshops
            var boldish = "**";
            if (current.category == "workshop") {
                boldish = "";
            }
            msg += current.begin + " \> " + current.end + ": " + boldish + current.title + boldish;
            if (current.category != "others") {
                msg += " | _" + current.location + "_";
            }
        }

        cb(null, activities, msg);
    });
}