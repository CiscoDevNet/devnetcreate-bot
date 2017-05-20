//
// Command: about
//
module.exports = function (controller) {

    controller.hears(['show\s*(.*)', 'more\s*(.*)', 'about\s*(.*)'], 'direct_message,direct_mention,mention', function (bot, message) {

        var keyword = message.match[1];
        if (!keyword) {
            chooseAmongActivities(bot, controller, message);
            return;
        }

        // Check arg for number
        var number = parseInt(keyword);
        if (number) {
            selectActivity(bot, controller, message, number);
            return;
        }

        // Not a number, return the 1st activity
        //bot.reply(message, "sorry, could not find this activity, picking another one");
        selectActivity(bot, controller, message, 1);
    });
}

function chooseAmongActivities(bot, controller, message) {
    controller.storage.users.get(message.user, function (err, user_data) {
        if (!user_data) {
            bot.reply(message, "Seems you have not looked for activities yet.<br/>Type "
                + bot.enrichCommand(message, "now")
                + " or "
                + bot.enrichCommand(message, "next")
                + " to check what's coming!");
            return;
        }

        var activities = user_data["activities"];
        if (activities.length == 0) {
            bot.reply(message, "Seems we don't have any activity to display details for!<br/>Is the conference over?");
            return;
        }

        var choices = "";
        for (var i = 0; i < activities.length; i++) {
            var current = activities[i];
            choices += "<br/>`" + (i + 1) + ")` ";
            choices += current.begin + " - " + current.end + ": " + current.title + " (" + current.location + ")";
        }

        bot.startConversation(message, function (err, convo) {
            convo.ask("Which activity are you inquiring about? (type a number or cancel)" + choices, [
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
                        selectActivity(bot, controller, message, number);
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

    });
}


function selectActivity(bot, controller, message, number) {
    controller.storage.users.get(message.user, function (err, user_data) {
        if (!user_data) {
            bot.reply(message, "Seems you have not looked for activities yet.<br/>Type "
                + bot.enrichCommand(message, "now")
                + " or "
                + bot.enrichCommand(message, "next")
                + " to check what's coming!");
            return;
        }

        var activities = user_data["activities"];
        if (number <= 0) number = 1;
        if (number > activities.length) number = activities.length;
        if (number == 0) {
            bot.reply(message, "Seems we don't have any activitiy to display details for!<br/>Is the conference over?");
            return;
        }

        var activity = activities[number - 1];
        bot.reply(message, showDetails(activity));
    });
}

function showDetails(activity) {
    // 1st line
    var md = "**" + activity.title + "**";
    // 2nd line
    var json_link = "([json](https://devnetcreate-api.herokuapp.com/api/v1/activities/" + activity.id + "))";
    md += "<br/>" + activity.fullDay + " from " + activity.begin + " till " + activity.end + " - " + activity.location + " " + json_link;
    // 3rd line
    md += "<br/>_by " + activity.speaker + "_";
    // 4th and after...
    md += "\n\n" + activity.description;

    return md;
}
