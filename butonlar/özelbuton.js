const moment = require("moment");
const Discord = require("discord.js");
const db = require("croxydb")
db.setReadable(true) // It makes readable your JSON DB file.

const { MessageActionRow, MessageSelectMenu, Modal ,TextInputComponent} = require('discord.js');

const { MessageEmbed } = require('discord.js')
module.exports =  { 
  run:async (client, interaction, kullanici) =>{
  if(kullanici!==interaction.user.id) return;
     const modal = new Modal()
                        .setCustomId('özelbutonayarla')
                        .setTitle('Pusula Ticket Sistemi - Özelleştirme');
                    const favoriteColorInput = new TextInputComponent()
                        .setCustomId(`metin2`)
                        .setLabel("Butonda gözükecek metni girin.")
                        .setStyle('SHORT')
                        .setRequired(true);
                    const emojiInput = new TextInputComponent()
                        .setCustomId(`metin1`)
                        .setLabel("Butonun başında gösterilecek emoji ismi")
                        .setStyle('SHORT')
  const firstActionRow = new MessageActionRow().addComponents(
        favoriteColorInput
      );
      const secondActionRow = new MessageActionRow().addComponents(
        emojiInput
      );
      modal.addComponents(firstActionRow, secondActionRow);         
                    await interaction.showModal(modal);
               
    
  }
}