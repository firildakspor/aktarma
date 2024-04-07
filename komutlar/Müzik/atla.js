const {getVoiceConnection,NoSubscriberBehavior,joinVoiceChannel,createAudioResource}=require('@discordjs/voice')
const ytdl=require('play-dl')
const { normal, hata } = require('/app/fonksiyonlar.js');

module.exports.run = async (client, interaction) => {
  await interaction.deferReply()

    let channel = interaction.member.voice.channel;
  if (!channel) return  await interaction.followUp(hata("Müzik durdurmak için bir sesli kanalda olmanız gerekiyor."));
if(!client.queue.get(interaction.guild.id)) return;
  const kuyruk=client.queue.get(interaction.guild.id)
if(kuyruk>1) return  await interaction.followUp(hata("Müzik atlamak için sırada bir şarkı bulunmuyor."));
  if(client.queue.get(interaction.guild.id).playing==false) return await interaction.followUp(hata("Şu anda bir şarkı çalmıyor."))
    const player=client.queue.get(interaction.guild.id).player
if(!player) return
  if(client.queue.get(interaction.guild.id).loop==true) client.queue.get(interaction.guild.id).songs.push(client.queue.get(interaction.guild.id).songs[0])
        client.queue.get(interaction.guild.id).songs.shift()
  if(!client.queue.get(interaction.guild.id).songs[0]) {
          client.queue.get(interaction.guild.id).connection.destroy();
      client.queue.delete(interaction.guild.id);
     await interaction.followUp(hata('Şarkı kapatıldı, ses bağlantısı sonlandırıldı.'));
   return
  }
     const stream = await ytdl.stream(client.queue.get(interaction.guild.id).songs[0].url);
      const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        inlineVolume: true 
        });
  resource.volume.setVolume(client.queue.get(interaction.guild.id).volume)
  client.queue.get(interaction.guild.id).player.stop()
  player.play(resource)
  await interaction.followUp(normal('Şarkı başarıyla atlandı.'));

 
}

exports.help = {
  name: 'atla',
  description: 'Sıradaki şarkıya geçer.',
options:[],
  category: 'Müzik',
};