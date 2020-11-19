const Discord =  require('discord.js');
const fs = require('fs');
const Client = require('./client/Client');
require('dotenv').config();

const { prefix } = require('./config.json');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}
console.log(client.commands);

client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on("ready", () => {
    console.log('MLGBot is online!');
});

client.on('message', async message => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    try {
        command.execute(message);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}

    // const args = message.content.slice(prefix.length).split(/ +/);
    // const command = args.shift().toLowerCase();

    // if(command === 'pog') {
    //     client.commands.get('pog').execute(message, args);
    // } else if(command == 'pogging') {
    //     client.commands.get('pogging').execute(message, args);
    // }
});

client.login(process.env.TOKEN);