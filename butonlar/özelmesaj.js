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
                        .setCustomId('özelmesajayarla')
                        .setTitle('Pusula Ticket Sistemi - Özelleştirme');
                    const favoriteColorInput = new TextInputComponent()
                        .setCustomId(`metin2`)
                        .setLabel("Metni girin")
                        .setStyle('SHORT')
                        .setRequired(true);

                    const firstActionRow = new MessageActionRow().addComponents(favoriteColorInput);
                    modal.addComponents(firstActionRow);
                    await interaction.showModal(modal);
               
    
  }
}