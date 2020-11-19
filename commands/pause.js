module.exports = {
	name: 'pause',
	description: 'Pause a song!',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to pause the music!');
		if (!serverQueue) return message.channel.send('There is no song that I could pause!');
		if(serverQueue.connection.dispatcher.paused) return message.channel.send('The song is already paused!')
		serverQueue.connection.dispatcher.pause();
		message.channel.send("The song has been paused!");
	},
};