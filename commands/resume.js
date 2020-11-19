module.exports = {
	name: 'resume',
	description: 'Resumes a song!',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to resume the music!');
		if (!serverQueue) return message.channel.send('There is no song that I could resume!');
		if(serverQueue.connection.dispatcher.resumed) return message.channel.send('The song is already playing!')
		serverQueue.connection.dispatcher.resume();
	},
};