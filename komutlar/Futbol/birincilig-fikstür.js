const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require('axios');

exports.run = async (client, interaction) => {
    await interaction.deferReply()
  const url = 'https://uneven-sequoia-lingonberry.glitch.me/birincilig/fikstur';

  // Başlangıç haftasını buradan ayarlayın
// İstediğiniz başlangıç haftası indeksini girin (örneğin 0, 14 gibi)

  try {
    const response = await axios.get(url);
    const data = response.data;

    const helpPages = Object.keys(data).map((hafta, index) => {
      const matches = data[hafta].join('\n');
      return new MessageEmbed()
        .setColor('RED')
        .setTitle(`Hafta ${index + 1}`)
        .setDescription(matches);
    });

    const response2 = await axios.get("https://uneven-sequoia-lingonberry.glitch.me/birincilig/sonhafta");
    const datas = response2.data;

  let startingWeekIndex = parseInt(datas); 
        
    let currentPage = startingWeekIndex;

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('previous')
          .setLabel('Önceki')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('next')
          .setLabel('Sonraki')
          .setStyle('PRIMARY')
      );

    const helpMessage = await interaction.followUp({ embeds: [helpPages[currentPage]], components: [row] });

    const filter = i => ['previous', 'next'].includes(i.customId);
    const collector = helpMessage.createMessageComponentCollector({ filter, time: 600000 });

    collector.on('collect', async (interaction) => {
       if (!interaction.channel.permissionsFor(interaction.guild.members.me).has('VIEW_CHANNEL')) return

      if (interaction.customId === 'previous') {
        currentPage = (currentPage - 1 + helpPages.length) % helpPages.length;
      } else if (interaction.customId === 'next') {
        currentPage = (currentPage + 1) % helpPages.length;
      }

      await interaction.update({ embeds: [helpPages[currentPage]] });
    });


  } catch (error) {
    console.error('Bir hata oluştu:', error);
  }
};

exports.help = {
  name: 'birincilig-fikstür',
  description: '1. Ligteki oynanan maçları gösterir',
  options:[]
};
