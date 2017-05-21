//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//


// Load env variables 
var env = require('node-env-file');
env(__dirname + '/.env');


//
// BotKit initialization
//

var Botkit = require('botkit');

if (!process.env.SPARK_TOKEN) {
    console.log("Could not start as this bot requires a Cisco Spark API access token.");
    console.log("Please add env variable SPARK_TOKEN on the command line");
    console.log("Example: ");
    console.log("> SPARK_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

if (!process.env.PUBLIC_URL) {
    console.log("Could not start as this bot must expose a public endpoint.");
    console.log("Please add env variable PUBLIC_URL on the command line");
    console.log("Example: ");
    console.log("> SPARK_TOKEN=XXXXXXXXXXXX PUBLIC_URL=YYYYYYYYYYYYY node bot.js");
    process.exit(1);
}

var controller = Botkit.sparkbot({
    log: true,
    public_address: process.env.PUBLIC_URL,
    ciscospark_access_token: process.env.SPARK_TOKEN,
    secret: process.env.SECRET, // this is a RECOMMENDED security setting that checks of incoming payloads originate from Cisco Spark
    webhook_name: 'devnetcreate-bot (' + process.env.NODE_ENV + ')',
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log("SPARK: Webhooks set up!");
    });

    // installing Healthcheck
    var uptime = Date.now();
    var version = require("./package.json").version;
    bot.commons = {};
    bot.commons["healthcheck"] = "https://devnetcreate-bot.herokuapp.com/ping";
    bot.commons["owner"] = "Cisco DevNet <https://developer.cisco.com>";
    bot.commons["support"] = "Stève Sfartz <mailto:stsfartz@cisco.com>";
    bot.commons["up-since"] = new Date(uptime).toGMTString();
    bot.commons["version"] = "v" + version;
    webserver.get('/ping', function (req, res) {
        res.json(bot.commons);
    });
});

// Load skills
var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    try {
        require("./skills/" + file)(controller);
    }
    catch (err) {
        if (err.code == "MODULE_NOT_FOUND") {
            if (file != "utils") {
                console.log("could not load skill: " + file);
            }
        }
    }
});

// Add Cisco Spark specific Group room mention
bot.enrichCommand = function (message, command) {
    if (message.original_message.roomType == "group") {
        return "`@devnetcreate " + command + "`";
    }

    return "`" + command + "`";
}

