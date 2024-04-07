const moment = require("moment");
const Discord = require("discord.js");
const db = require("croxydb")
db.setReadable(true) // It makes readable your JSON DB file.

const { MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');

const { MessageEmbed } = require('discord.js')
module.exports =  { 
  run:async (client, interaction, kullanici) =>{
  if(kullanici!==interaction.user.id) return;
    let emoji="🎟️"
 if (!interaction.channel.permissionsFor(interaction.guild.members.me).has('VIEW_CHANNEL')) return

    
                    if (!db.get(`ticket_${interaction.guild.id}.özel-ticket-mesaj`)) return interaction.channel.send({content:"Lütfen /ticket-ayarla komutuyla bir buton ayarlayın.", ephemeral:true});
                    if (!db.get(`ticket_${interaction.guild.id}.özel-ticket-buton`)) return interaction.channel.send({content:"Lütfen /ticket-ayarla komutuyla bir buton ayarlayın.", ephemeral:true});
                    if (db.get(`ticket_${interaction.guild.id}.özel-ticket-buton-emoji`)) {
                        emoji = db.get(`ticket_${interaction.guild.id}.özel-ticket-buton-emoji`);
                    }
                    const row = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId(`buton`)
                            .setLabel(db.get(`ticket_${interaction.guild.id}.özel-ticket-buton`))
                            .setStyle("SUCCESS")
                            .setEmoji(emoji)
                    );
                    const embed = new MessageEmbed().setTitle("Pusula Ticket Sistemi").setColor("GREEN")
                        .setDescription(db.get(`ticket_${interaction.guild.id}.özel-ticket-mesaj`));

                    interaction.channel.send({ embeds: [embed], components: [row] });
               
    
  }
}