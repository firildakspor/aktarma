const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    run: async (client, interaction, kullanici) => {
    
const deneme =interaction.customId.split("_")
if(deneme[1]!==interaction.user.id) return 

      const args = [];
      const commandName = "duraklat";
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
    .setLabel('Devam')
          .setEmoji('1155480300516806696')
    .setCustomId(`devam_${interaction.user.id}`);

  const row = new MessageActionRow().addComponents(playButton, deleteButton, pauseButton,loopButton, skipButton);
 
   const command =
        client.commands.get(commandName) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );
const konum = command.konum
    if(!konum) {
        return console.error(`${interaction.commandName} --> Böyle bir komutum yok.`)
    }

        const run = require(`.${konum}`)
    run.run(client, interaction,args);
 if (!interaction.channel.permissionsFor(interaction.guild.members.me).has('VIEW_CHANNEL')) return
interaction.message.edit({components:[row]})
      
    }
}