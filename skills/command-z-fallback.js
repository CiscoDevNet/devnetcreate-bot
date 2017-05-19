//
// Fallback Command
//
module.exports = function (controller) {

    controller.hears(["(.*)"], 'direct_message,direct_mention,mention', function (bot, message) {
        var text = "Sorry I did not understand. Try `help`, `now` or `next`";
        bot.reply(message, text);
    });
}