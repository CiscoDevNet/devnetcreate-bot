//
// Command: next
//

// event API wrapper
var activities = require("./utils/activities.js");

module.exports = function (controller) {

    controller.hears(['next', 'upcoming'], 'direct_message,direct_mention,mention', function (bot, message) {

        bot.reply(message, "_heard you! let's check what's coming..._");

        var limit = parseInt(message.match[1]);
        if (!limit) limit = 5;
        if (limit < 1) limit = 1;

        activities.fetchNext(limit, function (err, events, text) {
            if (err) {
                bot.reply(message, "**sorry, ball seems broken  :-(**");
                return;
            }

            // Store events
            var toPersist = { "id": message.user, "events": events };
            controller.storage.users.save(toPersist, function (err, id) {
                if (err != null) {
                    bot.reply(message, text);
                    return;
                }

                bot.reply(message, text + "\n\n_Type about [number] for more details_");
            });
        });

    });

}