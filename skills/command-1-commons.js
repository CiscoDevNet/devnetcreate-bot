//
// Command: bot commons
//
module.exports = function (controller) {

    controller.hears(["^ping", "^\.about", "^\.commons"], 'direct_message,direct_mention,mention', function (bot, message) {
        var metadata = '{\n'
            + '   "owner"       : "' + bot.commons["owner"] + '",\n'
            + '   "support"     : "' + bot.commons["support"] + '",\n'
            + '   "up-since"    : "' + bot.commons["up-since"] + '",\n'
            + '   "version"     : "' + bot.commons["version"] + '",\n'
            + '   "healthcheck" : "' + bot.commons["healthcheck"] + '"\n'
            + '}\n';
        bot.reply(message, '```json\n' + metadata + '\n```');
    });
}
