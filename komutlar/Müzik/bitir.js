const { createAudioResource, getVoiceConnection ,createAudioPlayer} = require('@discordjs/voice');
const { normal, hata } = require('/app/fonksiyonlar.js');

module.exports.run = async (client, interaction) => {
await interaction.deferReply()
  const connection = getVoiceConnection(interaction.guild.id);

  if (connection) {
    const queueConstruct = client.queue.get(interaction.guild.id);
      connection.destroy();
      client.queue.delete(interaction.guild.id);
     await interaction.followUp(normal('Şarkı kapatıldı, ses bağlantısı sonlandırıldı.'));
    
  } else {
   await interaction.followUp(hata('Bot bir ses kanalında değil.'));
  }
};


exports.help = {
  name: 'bitir',
  description: 'Şarkıyı bitirir.',
options:[],
    category: "Müzik"

};