const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
  const desteksunucu = new MessageButton()
    .setStyle('LINK')
    .setLabel('Destek Sunucusu')
    .setURL("https://discord.gg/VbkRBNW669")
const row = new MessageActionRow().addComponents(desteksunucu);

function normal(metin) {
  const embed = {embeds:[new MessageEmbed()
    .setTitle('İşlem Başarılı!')
    .setDescription(metin)
    .setColor('GREEN') // İstediğiniz rengi ekleyebilirsiniz
    .setTimestamp()
.setFooter({ text: 'Pusula', iconURL: 'https://cdn.discordapp.com/avatars/1123556792870371348/be36a90fc79f98a2d5ad231aa2e3d2d5.png?size=1024' })

]}
  return embed;
}

function hata(metin) {
  const embed = {embeds:[new MessageEmbed()
.setFooter({ text: 'Pusula', iconURL: 'https://cdn.discordapp.com/avatars/1123556792870371348/be36a90fc79f98a2d5ad231aa2e3d2d5.png?size=1024' })
    .setTitle('Bir Hata Oluştu..')
    .addFields({name:"\t" ,value: metin})
    .setColor('RED') // İstediğiniz rengi ekleyebilirsiniz
    .setTimestamp()
],components:[row]}
  return embed;
}

module.exports = { normal, hata };