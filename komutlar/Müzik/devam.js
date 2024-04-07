const {getVoiceConnection,NoSubscriberBehavior,joinVoiceChannel}=require('@discordjs/voice')
const { normal, hata } = require('/app/fonksiyonlar.js');

module.exports.run = async (client, interaction) => {
       await interaction.deferReply() 
    let channel = interaction.member.voice.channel;
  if (!channel) return  await interaction.followUp(hata("Müzik durdurmak için bir sesli kanalda olmanız gerekiyor."));

if(!client.queue.get(interaction.guild.id)) return;
  const player=client.queue.get(interaction.guild.id).player
if(!player) return
  if(client.queue.get(interaction.guild.id).playing==true) return await interaction.followUp(hata("Şu anda duraklatılmış bir şarkı yok."))
  player.unpause()
  client.queue.get(interaction.guild.id).playing=true
  await interaction.followUp(normal('Duraklatılan müzik tekrar oynatılıyor.'));

 
}

exports.help = {
  name: 'devam',
  description: 'Müziği devam ettirir.',
options:[],
  category: 'Müzik',
};