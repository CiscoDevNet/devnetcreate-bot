//
// Welcome message 
// sent as the bot is added to a Room
//
module.exports = function (controller) {

    controller.on('bot_space_join', function (bot, message) {
        bot.reply(message, "Hi, I am the [DevNet Create conference](https://devnetcreate.io/2017/pages/schedule/schedule.html) bot!\n\n**Type `next` or `now` to see me in action.**", function (err, newMessage) {
            if (newMessage.roomType == "group") {
                bot.reply(message, "<br/>_Note that this is a 'Group' Space. I will answer only if mentionned.<br/>for example, you would type: `@devnetcreate next`_");
            }
        });
    });
}
