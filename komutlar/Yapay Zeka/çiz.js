const Discord = require('discord.js');
const axios = require('axios');

module.exports.run = async (client, interaction) => {
  await interaction.deferReply()
  const args = interaction.options.getString('resim'); 
  const url = `https://hercai.onrender.com/v2/text2image?prompt=${encodeURIComponent(args)}`; 
  try {
    
    const resim = await axios.get(url);
    if(!resim.data.url) return interaction.followUp("Resminiz yapılamadı. Tekrar deneyin.")
  await interaction.followUp({
      files: [{
        attachment: resim.data.url,
        name: 'resim.png'
      }],
      content: `<@${interaction.user.id}>`,
    });
  } catch (error) {
    console.error("Resim alınırken bir hata oluştu:", error);
   await interaction.followUp("Resim oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
  }
};

exports.help = {
  name: 'çiz',
  description: 'Yapay zeka ile resim yapar.',
  options: [{
    name: "resim",
    description: "Resim",
    type: 3,
    required: true,
  }],
  category: 'Kullanıcı'
};