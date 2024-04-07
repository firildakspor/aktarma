const { createAudioResource, getVoiceConnection ,createAudioPlayer} = require('@discordjs/voice');
const {MessageEmbed}=require('discord.js')
const { normal, hata } = require('/app/fonksiyonlar.js');
module.exports.run = async (client, interaction) => {
await interaction.deferReply() 
 const queueConstruct = client.queue.get(interaction.guild.id);
  if(!queueConstruct) return  await interaction.followUp(hata("Şu anda oynatılan bir kuyruk bulunmuyor."))
console.log(queueConstruct)
  const sarki= queueConstruct.songs[0]
  const embed =new MessageEmbed().setTitle("Şarkı kaydedildi.")
  .addFields({name:`Şarkı:`,value:`${sarki.title}`})
  .addFields({name:`Şarkı URL:`,value:`${sarki.url}`})
  .addFields({name:`Şarkı Süresi:`,value:`${sarki.duration}`})
  .addFields({name:`Sunucu:`,value:`${interaction.guild.name}`})
  .addFields({name:`Kanal:`,value:`<#${queueConstruct.connection.joinConfig.channelId}>`})
  	.setFooter({ text: 'Pusula', iconURL: 'https://cdn.discordapp.com/avatars/1123556792870371348/be36a90fc79f98a2d5ad231aa2e3d2d5.png?size=1024' })
.setColor("YELLOW")
  .setThumbnail(sarki.img)
   interaction.user.send({embeds:[embed]})
 await interaction.followUp(normal("Şarkı bilgileri DM üzerinden gönderildi."))
};


exports.help = {
  name: 'kaydet',
  description: 'Oynatılan şarkıyı size DM kutusu üzerinden gönderir.',
options: [],
  category: "Müzik"
};
