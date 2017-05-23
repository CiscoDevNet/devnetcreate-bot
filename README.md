# Cisco Spark bot for DevNet Create 2017 developer conference

This bot is built with the Cisco Spark adapter from the BotKit framework.
It leverages both user-context and conversations from BotKit.
It also requests an external [Live API](https://github.com/ObjectIsAdvantag/live-api) to fetch activities in real time. 
Yo can give it a try by inviting `devnetcreate@sparkbot.io` to a Cisco Spark space (note that the bot works in both Direct and Group rooms).

**New to BotKit?**
Read the [BotKit for CiscoSpark Guide](https://github.com/howdyai/botkit/blob/master/readme-ciscospark.md)

**New to CiscoSpark?**
Read the [Starter Guide](https://github.com/ObjectIsAdvantag/hackathon-resources#cisco-spark-starter-guide-chat-calls-meetings) we use at hackathon. Or go straight to [Spark4Devs](https://developer.ciscospark.com), signin and click [My apps](https://developer.ciscospark.com/apps.html) to create a bot account.

Brought to you by [Cisco DevNet](https://developer.cisco.com) and [Spark 4 Developers](https://developer.ciscospark.com).


## The devnetcreate bot at work

Once you have invited the `devnetcreate@sparkbot.io` to a Cisco Spark space, you get a nice welcome message:

![](docs/img/welcome.png)

Then type `next` or `@devnetcreate next` in a group space to see upcoming activities:

![](docs/img/next.png)

Once you've loaded a few activities, you ready to dig into details with the about command which illustrates a conversation with BotKit, as you can type those commands in 2 steps. 
First type `about`:

![](docs/img/about-step1.png)

then type `2` for example: 

_Note that you can also type `about 2` but then it is not a conversation you'll be initiating but simply a command (technically speaking)._

As it is a 2 steps conversation you're having, you'll need to type `cancel` if you don't want to proceed and see details.

![](docs/img/about-step2.png)


## Installation

Assuming your bot is accessible from the internet or you expose it via [ngrok](https://ngrok.com);
you can run any sample in a snatch:

From a bash shell, type:

```shell
> git clone https://github.com/CiscoDevNet/devnetcreate-bot
> cd devnetcreate-bot
> npm install
> SPARK_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" node bot.js
```

From a windows shell, type:

```shell
> git clone https://github.com/CiscoDevNet/devnetcreate-bot
> cd devnetcreate-bot
> npm install
> set SPARK_TOKEN="0123456789abcdef"
> set PUBLIC_URL="https://abcdef.ngrok.io"
> set SECRET="not that secret"
> node bot.js
```

where:

- SPARK_TOKEN is the API access token of your Cisco Spark bot
- PUBLIC_URL is the root URL at which Cisco Spark can reach your bot
- SECRET is the secret that Cisco Spark uses to sign the JSON webhooks events posted to your bot
- [ngrok](http://ngrok.com) helps you expose the bot running on your laptop to the internet, type: `ngrok http 8080` to launch
