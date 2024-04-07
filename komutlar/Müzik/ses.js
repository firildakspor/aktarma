const {getVoiceConnection,NoSubscriberBehavior,joinVoiceChannel,createAudioResource}=require('@discordjs/voice')
const ytdl=require('play-dl')
const { normal, hata } = require('/app/fonksiyonlar.js');

module.exports.run = async (client, interaction, args) => {
    let channel = interaction.member.voice.channel;
  if (!channel) return  interaction.reply(hata("Müzik durdurmak için bir sesli kanalda olmanız gerekiyor."));
        const duzey = interaction.options.get('duzey').value;
if(duzey>501)return interaction.reply(hata('Şarkı düzeyi en fazla 500 olabilir'));
if(!client.queue.get(interaction.guild.id)) return;
  const player=client.queue.get(interaction.guild.id).player
if(!player) return
  if(client.queue.get(interaction.guild.id).playing==false) return interaction.reply(hata("Şu anda bir şarkı çalmıyor."))
     const stream = await ytdl.stream(client.queue.get(interaction.guild.id).songs[0].url);
      const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        inlineVolume: true 
        });
      resource.volume.setVolume(parseInt(duzey)/100);
client.queue.get(interaction.guild.id).volume = parseInt(duzey)/100
  client.queue.get(interaction.guild.id).player.stop()
  player.play(resource)
  await interaction.reply(normal('Şarkı ses düzeyi ayarlandı.'));

 
}

exports.help = {
  name: 'ses',
  description: 'Şarkı ses düzeyi ayarlar.',
options:[{
            name: "duzey",
            description: "Şarkının ses seviyesini girin.",
            type: 4,
            required: true,
        }],
  category: 'Müzik',
};