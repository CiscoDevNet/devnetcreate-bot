//
// Welcome message 
// sent as the bot is added to a Room
//
module.exports = function (controller) {

    controller.on('bot_space_join', function (bot, message) {
        bot.reply(message, "Hi, I am the [DevNetCreate](https://devnetcreate.io/2017/pages/schedule/schedule.html) bot!\n\nType `next` to see me in action.", function (err, newMessage) {
            if (newMessage.roomType == "group") {
                bot.reply(message, "\n\n**Note that this is a 'Group' room. I will answer only when mentionned.**");
            }
        });
    });
}
