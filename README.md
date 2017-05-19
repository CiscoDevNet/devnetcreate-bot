# Cisco Spark bot for DevNet Create 2017 developer conference

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

**New to BotKit?**
Read the [BotKit for CiscoSpark Guide](https://github.com/howdyai/botkit/blob/master/readme-ciscospark.md)

**New to CiscoSpark?**
Read the [Starter Guide](https://github.com/ObjectIsAdvantag/hackathon-resources#cisco-spark-starter-guide-chat-calls-meetings) we use at hackathon. Or go straight to [Spark4Devs](https://developer.ciscospark.com), signin and click [My apps](https://developer.ciscospark.com/apps.html) to create a bot account.
