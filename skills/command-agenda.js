//
// Command: Agenda
//
module.exports = function (controller) {

    controller.hears(["agenda", "plan", "conference"], 'direct_message,direct_mention,mention', function (bot, message) {
        // Give directions / welcome 
        var text = "not implemented yet";
        bot.reply(message, text);
    });
}