const { MessageEmbed } = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');
  const { normal, hata } = require('/app/fonksiyonlar.js');

module.exports.run = async (client, interaction) => {
  await interaction.deferReply() 
  const serverQueue = client.queue.get(interaction.guild.id);

  if (!serverQueue) {
    return await interaction.followUp(hata("Şu anda oynatılan bir müzik bulunmuyor."));
  }

  serverQueue.loop = !serverQueue.loop;

  const loopStatus = serverQueue.loop ? "açıldı" : "kapatıldı";

  const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setTitle('Döngü Modu')
    .setDescription(`Döngü modu başarıyla **${loopStatus}**`)
    .setTimestamp()
  	.setFooter({ text: 'Pusula', iconURL: 'https://cdn.discordapp.com/avatars/1123556792870371348/be36a90fc79f98a2d5ad231aa2e3d2d5.png?size=1024' })

 await interaction.followUp({ embeds: [embed] });
};


exports.help = {
  name: 'döngü',
  description: 'Döngü Modunu açar veya kapatır.',
  options:[],
  category: "Müzik"
};
