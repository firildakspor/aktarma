const { TextInputComponent, MessageActionRow, Modal } = require('discord.js');

module.exports = {
    run: async (client, interaction, kullanici) => {
   
      const modal = new Modal()
        .setCustomId("myModal")
        .setTitle("Pusula Şarkı Çalma");
      const favoriteColorInput = new TextInputComponent()
        .setCustomId(`sarkical`)
        .setLabel("Şarkıyı aratın..")
        .setStyle("SHORT")
        .setRequired(true);

      const firstActionRow = new MessageActionRow().addComponents(
        favoriteColorInput
      );

      modal.addComponents(firstActionRow);
      // Show the modal to the user
      await interaction.showModal(modal);
    }
}