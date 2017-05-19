//
// Command: help
//
module.exports = function (controller) {

    controller.hears(["help", "who"], 'direct_message,direct_mention,mention', function (bot, message) {
        var text = "Discover upcoming activities at [DevNetCreate](https://devnetcreate.io/2017).<br/>Type `now`, `next [max]` or `about [index]`";
        bot.reply(message, text);
    });
}
