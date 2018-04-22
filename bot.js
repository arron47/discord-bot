var Discord = require('discord.io');
var logger = require('winston');
var auth = process.env.auth;
var text = require('./text.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Parse the channel message into one item
function parseJSON(array) {
    var JSONparsed = "";
    for(i in array) {
        JSONparsed += array[i];
    }
    return JSONparsed;
}
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Assign variables for the assignable roles
    var serverID = bot.values(guild).id;
    var speedRole = bot.values(guild.roles).find(r => r.name == "Gotta Go Fsat").id;
    var movieRole = bot.values(guild.roles).find(r => r.name == "Movie Night").id;

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // !channels
            case 'channels':
                bot.sendMessage({
                    to: channelID,
                    message: parseJSON(text.channels)
                });
            break;
            // !help
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: parseJSON(text.commands)
                });
            break;
            // !roles
            case 'roles':
                bot.sendMessage({
                    to: channelID,
                    message: parseJSON(text.roles)
                });
                switch(args[0]) {
                    // !roles speed
                    case 'speed':
                        if(user.values(roles).has(speedRole)) {
                            bot.removeFromRole(serverID, userID, speedRole);
                            bot.sendMessage({
                                to: channelID,
                                message: "You've been removed from the 'Gotta Go Fsat' role!"
                            });
                        } else {
                            bot.addToRole(serverID, userID, speedRole);
                            bot.sendMessage({
                                to: channelID,
                                message: "You're part of the 'Gotta Go Fsat' role now!"
                            });
                        }
                    break;
                    // !roles movie
                    case 'movie':
                    if(user.values(roles).has(movieRole)) {
                        bot.removeFromRole(serverID, userID, movieRole);
                        bot.sendMessage({
                            to: channelID,
                            message: "You've been removed from the 'Movie Night' role!"
                        });
                    } else {
                        bot.addToRole(serverID, userID, movieRole);
                        bot.sendMessage({
                            to: channelID,
                            message: "You're part of the 'Movie Night' role now!"
                        });
                    }
                }
            break;
            // Just add any case commands if you want to..
         }
     }
});