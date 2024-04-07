const moment = require("moment");
const Discord = require("discord.js");
const db = require("croxydb");
db.setReadable(true);

const { MessageActionRow, MessageSelectMenu, Modal, TextInputComponent } = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (client, interaction, kullanici) => {

        const ticket = db.get(`ticket_${interaction.guild.id}.sayı`) || 0;
        let categoryId = db.get(`ticket_${interaction.guild.id}.kategori`); // Kategori ID'si, belirli bir kategoriye açmak istiyorsanız burayı doldurun

        let channelOptions = {
            type: 'text',
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
        };

        if (categoryId) {
            channelOptions.parent = categoryId; // Eğer kategori ID'si tanımlı ise kanalı o kategoriye aç
        }

        const gorecekRoller = db.get(`ticket_${interaction.guild.id}.roller`)
console.log(gorecekRoller)
        if (gorecekRoller && gorecekRoller.length > 0) {
for (const i in gorecekRoller){
  const hasPermission = interaction.guild.roles.cache.get(gorecekRoller[i]);
  if(!hasPermission) continue;
  channelOptions.permissionOverwrites.push({
                    id: gorecekRoller[i],
                    allow: ['VIEW_CHANNEL'],
                });
}
                
            }
        

        interaction.guild.channels.create(`ticket-${(ticket + 1).toString()}`, channelOptions)
            .then(channel => {
                let responseMessage = `Yeni özel kanal oluşturuldu: <#${channel.id}>`;
                
                interaction.reply({ content: responseMessage, ephemeral: true });

                db.add(`ticket_${interaction.guild.id}.sayı`, 1);
                channel.send(`Merhaba <@${interaction.user.id}>, destek kanalına hoş geldin.`);
            })
            .catch(error => {
                console.error('Kanal oluşturma hatası:', error);
            });
    }
};