//
// Command: Where
//
module.exports = function (controller) {

    controller.hears(["where", "directions"], 'direct_message,direct_mention,mention', function (bot, message) {
        // Give directions / welcome 
        var text = "Not implemented yet";
        bot.reply(message, text);
    });
}