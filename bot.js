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
    var serverID = bot.channels[channelID].guild_id;
    var speedRole = Object.values(bot.servers[serverID].roles).find(r => r.name == "Gotta Go Fsat").id;
    var movieRole = Object.values(bot.servers[serverID].roles).find(r => r.name == "Movie Night").id;

    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        args = args.map(v => v.toLowerCase());
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
                if(!args[0]){
                    bot.sendMessage({
                        to: channelID,
                        message: parseJSON(text.roles)
                    });
                }
                switch(args[0]) {
                    // !roles speed
                    case 'speed':
                        if(bot.servers[serverID].members[userID].roles.includes(speedRole)) {
                            bot.removeFromRole({
                                serverID: serverID, 
                                userID: userID, 
                                roleID: speedRole
                            });
                            bot.sendMessage({
                                to: channelID,
                                message: "You've been removed from the 'Gotta Go Fsat' role!"
                            });
                        } else {
                            bot.addToRole({
                                serverID: serverID, 
                                userID: userID, 
                                roleID: speedRole
                            });
                            bot.sendMessage({
                                to: channelID,
                                message: "You're part of the 'Gotta Go Fsat' role now!"
                            });
                        }
                    break;
                    // !roles movie
                    case 'movie':
                    if(bot.servers[serverID].members[userID].roles.includes(movieRole)) {
                        bot.removeFromRole({
                            serverID: serverID, 
                            userID: userID, 
                            roleID: movieRole
                        });
                        bot.sendMessage({
                            to: channelID,
                            message: "You've been removed from the 'Movie Night' role!"
                        });
                    } else {
                        bot.addToRole({
                            serverID: serverID, 
                            userID: userID, 
                            roleID: movieRole
                        });
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