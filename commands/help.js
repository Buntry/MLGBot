const fs = require('fs')

module.exports = {
    name: 'help',
    description: 'get a list of possible commands!',
    async execute(message) {
        let str = '';
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for(const file of commandFiles) {
            const command = require(`./${file}`);
            str += `Command Name: ${command.name}\nDescription: ${command.description}\n\n`
        }
        message.channel.send(str);
    }
};