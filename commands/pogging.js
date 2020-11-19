module.exports = {
    name: 'pogging',
    description: 'this is a pogging command',
    execute(message, args) {
        message.channel.send('I am pogging!')
    }
}