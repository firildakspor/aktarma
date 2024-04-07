const {getVoiceConnection,NoSubscriberBehavior,joinVoiceChannel}=require('@discordjs/voice')
const { normal, hata } = require('/app/fonksiyonlar.js');

module.exports.run = async (client, interaction) => {

  await interaction.deferReply() 
    let channel = interaction.member.voice.channel;
  if (!channel) return await interaction.followUp(hata("Müzik durdurmak için bir sesli kanalda olmanız gerekiyor."));

if(!client.queue.get(interaction.guild.id)) return;
  const player=client.queue.get(interaction.guild.id).player
if(!player) return
  if(client.queue.get(interaction.guild.id).playing==false) return await interaction.followUp(hata("Şu anda bir şarkı çalmıyor."))
  player.pause()
  client.queue.get(interaction.guild.id).playing=false
  await interaction.followUp(normal('Şu an oynatılan müzik duraklatıldı.'))

 
}

exports.help = {
  name: 'duraklat',
  description: 'Müziği durdurur.',
options:[],
  category: 'Müzik',
};