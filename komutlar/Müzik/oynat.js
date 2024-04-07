const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('play-dl');
const yts = require("yt-search");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { normal, hata } = require('/app/fonksiyonlar.js');

module.exports.run = async (client, interaction, arg) => {
const a = await interaction.deferReply()
  console.log(a)
  function formatDuration(input) {
    const secondsMatch = input.match(/(\d+) seconds/);
    const minutesMatch = input.match(/\((\d+):(\d+)\)/);

    let totalSeconds = 0;
    if (secondsMatch) {
        totalSeconds += parseInt(secondsMatch[1], 10);
    }

    if (minutesMatch) {
        totalSeconds += parseInt(minutesMatch[1], 10) * 60 + parseInt(minutesMatch[2], 10);
    }

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    let durationString = '';

    if (minutes > 0) {
        durationString += `${minutes/2} Dakika`;
        if (remainingSeconds > 0) {
            durationString += ', ';
        }
    }

    if (remainingSeconds > 0) {
        durationString += `${remainingSeconds/2} Saniye`;
    }

    return durationString.trim();
}
  
let args;
  if(interaction.options){
args = interaction.options.get('sarki').value;
  } else {args=arg}
  const queues = client.queue;

  let songInfo = null;
  let song = null;

  let channel = interaction.member.voice.channel;
  if (!channel) return await interaction.followUp(hata("Müzik açmak için bir sesli kanalda olmanız gerekiyor."));

  const permissions = channel.permissionsFor(interaction.client.user);
  if (!permissions.has("CONNECT")) return await interaction.followUp(hata("Kanalınıza bağlanma yetkim bulunmuyor."));
  if (!permissions.has("SPEAK")) return await interaction.followUp(hata("Kanalınızda konuşma yetkim bulunmuyor."));

  var searchString = args
  if (!searchString) return await interaction.followUp(hata("Çalacağım bir şarkı adı yazmalısınız."));

  const url = args.replace(/<(.+)>/g, "$1")

  if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
    try {
      songInfo = await ytdl.stream(url);
      if (!songInfo) return await interaction.followUp(hata("Yazdığınız şarkıyı Youtube'da bulamadım."));

      song = {
        id: songInfo.videoDetails.videoId,
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
        duration: songInfo.videoDetails.lengthSeconds,
       req: interaction.user.tag,
      };
    } catch (error) {
      console.error(error);
      return await interaction.followUp(hata(`Hata: ${error.message}`));
    }
  } else {
    try {
      var searched = await yts.search(searchString);
      if (searched.videos.length === 0) return await interaction.followUp(hata("Yazdığınız şarkıyı Youtube'da bulamadım."));

      songInfo = searched.videos[0];
      song = {
        id: songInfo.videoId,
        title: songInfo.title,
        url: songInfo.url,
        img: songInfo.image,
        duration: formatDuration(songInfo.duration.toString()),
        req: interaction.user.tag,
      };
    } catch (error) {
      console.error(error);
      return await interaction.followUp(hata(`Hata: ${error.message}`));
    }
  }

  let queueConstruct = queues.get(interaction.guild.id);
  if (!queueConstruct) {
    queueConstruct = {
      textChannel: interaction.channel.id,
      voiceChannel: channel,
      connection: null,
      player: null,
      songs: [],
      volume: 0.8,
      playing: false,
      loop: false,
    };
  }
  queueConstruct.songs.push(song);
  queues.set(interaction.guild.id, queueConstruct);

  if (!queueConstruct.playing) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    queueConstruct.connection = connection;
  const player=createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
    connection.subscribe(player);
    queueConstruct.player = player;

player.on(AudioPlayerStatus.Idle, async () => {


  if (queueConstruct.songs.length > 0) {
   
    if (!queueConstruct.loop) {
      queueConstruct.songs.shift();
      if (!queueConstruct.songs[0]) {
        connection.destroy();
        queues.delete(interaction.guild.id);
        return;
      }

      const stream = await ytdl.stream(queueConstruct.songs[0].url);
      const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
                inlineVolume: true 
        });
resource.volume.setVolume(queueConstruct.volume)

      player.play(resource);
    } else {
      queueConstruct.songs.push(queueConstruct.songs[0]);
      queueConstruct.songs.shift();
      const stream = await ytdl.stream(queueConstruct.songs[0].url);
      const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
                inlineVolume: true 
        });
      resource.volume.setVolume(queueConstruct.volume)
      player.play(resource);
    }
  } else {
    connection.destroy();
    queues.delete(interaction.guild.id);
  }
});

    player.on('stateChange', (oldState, newState) => {
      if (newState.status == "autopaused") {
        client.queue.delete(interaction.guild.id);
      }
    });
let stream;
      try {
    stream = await ytdl.stream(song.url)
  } catch (error) {
    if (error.message.includes('Sign in to confirm your age')) {
     return await interaction.followUp(hata("Bu videoyu izlemek için yaş doğrulaması gerekiyor."));
    } else {
      await interaction.followUp(hata("Bir hata oluştu."));
      console.error('Video indirme hatası:', error);
      return
    }
  }
    
    const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
              inlineVolume: true 

        });
    player.play(resource);
    queueConstruct.playing = true;
  }

  const playButton = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('Ekle')
    .setEmoji('1155482172988330095')
    .setCustomId(`sarkical_${interaction.user.id}`);

  const deleteButton = new MessageButton()
    .setStyle('DANGER')
    .setLabel('Bitir')
    .setEmoji('1155481463836377169')
    .setCustomId(`bitir_${interaction.user.id}`);

  const loopButton = new MessageButton()
    .setStyle('PRIMARY')
    .setLabel('Döngü')
    .setEmoji('1155479585052434523')
    .setCustomId(`döngü_${interaction.user.id}`);

  const skipButton = new MessageButton()
    .setStyle('PRIMARY')
    .setLabel('Atla')
    .setEmoji('1155479743555190785')
    .setCustomId(`satla_${interaction.user.id}`);

  const pauseButton = new MessageButton()
    .setStyle('DANGER')
    .setLabel('Durdur')
    .setEmoji('1155479988578045992')
    .setCustomId(`duraklat_${interaction.user.id}`);

  const row = new MessageActionRow().addComponents(playButton, deleteButton, pauseButton,loopButton, skipButton );
  
  let thing = new MessageEmbed()
    .setThumbnail(song.img)
    .setColor("GREEN")
    .addFields({ name: "Şarkı Adı", value: song.title })
    .addFields({ name: "Süre", value: song.duration })
    .addFields({ name: "Açan Kullanıcı", value: song.req })
	.setAuthor({ name: 'Şarkı Kuyruğa Eklendi', iconURL: 'https://cdn.discordapp.com/avatars/1123556792870371348/be36a90fc79f98a2d5ad231aa2e3d2d5.png?size=128', url: song.url })

await interaction.followUp({ ephemeral: true, embeds: [thing], components: [row] })

};

exports.help = {
  name: 'oynat',
  description: 'Şarkı araması yapar.',
  category: "Müzik",
  options: [{
            name: "sarki",
            description: "Çalacağınız şarkının ismini ya da URL'sini girin.",
            type: 3,
            required: true,
        }],
 
};