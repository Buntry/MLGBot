const ytdl = require("ytdl-core");
const key = process.env.YT_SEARCH_KEY;
const { YTSearcher } = require('ytsearcher');
const searcher = new YTSearcher({
  key,
  revealed: true
});

module.exports = {
    name: "play",
    description: "Play a song in your channel!",
    async execute(message) {
        
      try {
        const args = message.content.split(" ");
        args.shift();
        if(args.length == 0) {
          return message.channel.send("You need to enter a youtube search argument or a youtube link!");
        }

        const queue = message.client.queue;
        const serverQueue = message.client.queue.get(message.guild.id);
  
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
          return message.channel.send("You need to be in a voice channel to play music!");

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
          return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        let result = await searcher.search(args.join(" "), { type: "video" })
        const songInfo = await ytdl.getInfo(result.first.url)
        const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url
        };
  
        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          };
  
          queue.set(message.guild.id, queueContruct);
  
          queueContruct.songs.push(song);
  
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            this.play(message, queueContruct.songs[0]);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        } else {
          serverQueue.songs.push(song);
          return message.channel.send(
            `${song.title} has been added to the queue!`
          );
        }
      } catch (error) {
        console.log(error);
        message.channel.send(error.message);
      }
    },
  
    play(message, song) {
      const queue = message.client.queue;
      const guild = message.guild;
      const serverQueue = queue.get(message.guild.id);
  
      if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      }
  
      const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          serverQueue.songs.shift();
          this.play(message, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
  };