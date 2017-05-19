//
// Command: about
//
module.exports = function (controller) {

    controller.hears(['show\s*(.*)', 'more\s*(.*)', 'about\s*(.*)'], 'direct_message,direct_mention,mention', function (bot, message) {

        var keyword = message.match[1];
        if (!keyword) {
            bot.startConversation(message, function (err, convo) {
                convo.ask("Which activity are you inquiring about? (type a number or cancel)", [
                    {
                        pattern: "cancel",
                        callback: function (response, convo) {
                            convo.next();
                        }
                    },
                    {
                        pattern: "([0-9]+)\s*",
                        callback: function (response, convo) {
                            var value = parseInt(response.match[1]);
                            convo.setVar("number", value);
                            convo.next();
                        }
                    },
                    // {
                    //     pattern: "([a-zA-Z]+)\s*",
                    //     callback: function (response, convo) {
                    //         var value = response.match[1];
                    //         convo.setVar("keyword", value);
                    //         convo.next();
                    //     }
                    // },
                    {
                        default: true,
                        callback: function (response, convo) {
                            // just repeat the question
                            convo.say("Sorry I did not understand, either specify a number or cancel");
                            convo.repeat();
                            convo.next();
                        }
                    }
                ], { 'key': 'about' });

                convo.on('end', function (convo) {
                    if (convo.status == 'completed') {

                        //var about = convo.extractResponse('about');
                        var number = convo.vars["number"];
                        if (number) {
                            displayActivity(bot, controller, message, number);
                            return;
                        }

                        // not cancel, nor a number
                        bot.reply(message, 'cancelled!');
                    }
                    else {
                        // this happens if the conversation was ended prematurely for some reason
                        bot.reply(message, "sorry, could not process your request, try again..");
                    }
                });
            });
            return;
        }

        // Check arg for number
        var number = parseInt(keyword);
        if (number) {
            displayActivity(bot, controller, message, number);
            return;
        }

        // Not a number
        bot.reply(message, "sorry, not implemented yet!");
    });
}

function displayActivity(bot, controller, message, number) {
    controller.storage.users.get(message.user, function (err, user_data) {
        if (!user_data) {
            bot.reply(message, "Please look for current or upcoming events, before inquiring about event details");
            return;
        }

        var events = user_data["events"];
        if (number <= 0) number = 1;
        if (number > events.length) number = events.length;
        if (number == 0) {
            bot.reply(message, "sorry, seems we don't have any event to display details for");
            return;
        }

        var event = events[number - 1];
        bot.reply(message, Events.generateEventsDetails(event));
    });
}