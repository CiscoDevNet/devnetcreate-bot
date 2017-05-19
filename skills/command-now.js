//
// Command: now
//

// event API wrapper
var activities = require("./utils/activities.js");

module.exports = function (controller) {

    controller.hears(['future', 'fan'], 'direct_message,direct_mention,mention', function (bot, message) {

        bot.reply(message, "_heard you! let's check what's happening now..._");

        activities.fetchCurrent(function (err, events, text) {
            if (err) {
                bot.reply(message, "*sorry, could not contact the organizers :-(*");
                return;
            }

            if (events.length == 0) {
                bot.reply(message, text + "\n\n_Type `next` for upcoming events_");
                return;
            }

            // Store events
            var toPersist = { "id": message.user, "events": events };
            controller.storage.users.save(toPersist, function (err, id) {
                bot.reply(message, text + "\n\n_Type about [number] for more details_");
            });
        });
    });
}