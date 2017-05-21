//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention,mention', function (bot, message) {
        var text = "Discover upcoming activities at [DevNetCreate](https://devnetcreate.io/2017).<br/>Type " 
         + bot.enrichCommand(message, "now")
         + ", " 
         + bot.enrichCommand(message, "next [max]") 
         + " or "
         + bot.enrichCommand(message, "about [index]");
        bot.reply(message, text);
    });
}
