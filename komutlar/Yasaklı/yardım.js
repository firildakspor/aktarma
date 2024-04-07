const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const fs = require('fs');
const prefix  = "/"

module.exports.run = async (client, message, args) => {
  function ilkHarfiBuyut(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
  const deleteButton = new MessageButton()
    .setStyle('LINK')
    .setLabel('Destek Sunucusu')
    .setURL("https://discord.gg/VbkRBNW669")
  
  const commandFiles = client.commands
  const commands = commandFiles.map(file => {
    return {
      name: `${file.name}`,
      description: file.description,
      category: ilkHarfiBuyut(file.category) // Kategori bilgisini ekledik
    };
  });

  const excludedCommands = ['Yasaklı','Sahip'];

  const filteredCommands = commands.filter(command => !excludedCommands.includes(command.category));

  // Kategorilere göre komutları grupluyoruz
  const groupedCommands = {};
  filteredCommands.forEach(command => {
    if (!groupedCommands[command.category]) {
      groupedCommands[command.category] = [];
    }
    groupedCommands[command.category].push(command);
  });
  let oylama = [];
  // Belirli bir sıraya göre kategorileri listeleyeceğimiz dizi
const sira = Object.keys(groupedCommands).sort();

  sira.forEach(oy => {
    const yeniSecenek = {
      label: oy,
      description: oy,
      value: oy
    };
    oylama.push(yeniSecenek);
  });

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('kategoriler')
      .setPlaceholder('Detaylı Kategoriler')
      .addOptions(oylama)
  );
  const row2 = new MessageActionRow().addComponents(deleteButton);

  const embed = new MessageEmbed().setTitle('Tüm Komutlar')
  .setColor('YELLOW')
    	.setFooter({ text: 'Pusula', iconURL: 'https://cdn.discordapp.com/avatars/1123556792870371348/be36a90fc79f98a2d5ad231aa2e3d2d5.png?size=1024' });

  sira.forEach(category => {
    if (groupedCommands[category]) {
      const categoryCommandsText = groupedCommands[category].map(
        command => `\`${prefix}${command.name}\``
      );
      embed.addFields({ name: `\n_${category}_`, value: categoryCommandsText.join('\u200B,  \u200B') });
    }
  });

 const msg =await message.reply({ephemeral:true, embeds: [embed], components: [row,row2] })
    const filter = i => i.user.id === message.author.id;

};

exports.help = {
  name: "yardım",
  description: "Pusula botun yardım menüsüne erişmek için kullanabilirsin!",
  options: [],
  category: "Yasaklı",
}

