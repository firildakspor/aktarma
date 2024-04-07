const { getLyrics, getSong } = require('genius-lyrics-api');
const { MessageEmbed } = require('discord.js');
const { normal, hata } = require('/app/fonksiyonlar.js');
module.exports.run = async (client, interaction, args) => {
  await interaction.deferReply()
    if (!client.queue.get(interaction.guild.id)) return await interaction.followUp(hata("Şu anda bir şarkı çalmıyor."));
    if (client.queue.get(interaction.guild.id).playing === false) return await interaction.followUp(hata("Şu anda bir şarkı çalmıyor."));
    if (!client.queue.get(interaction.guild.id).songs[0]) return await interaction.followUp(hata("Şu anda bir şarkı çalmıyor."));
  
    const sarki = client.queue.get(interaction.guild.id).songs[0];
    const options = {
        apiKey: 'X0CFGxYoQJ5dnRPiBAr7SmqhGNF43MbMuN8QmuPMkAXXuoxrIuuulsikDmyzieL4',
        title: sarki.title,
        artist: sarki.title,
        optimizeQuery: true
    };

    try {
        const song = await getSong(options);

        // Şarkı sözlerindeki istenmeyen kısımları sil
        const cleanedLyrics = song.lyrics.replace(/\[.*?\]/g, '');

        // Paragraflar arasında bir boşluk ekleyerek metni düzenle
        const formattedLyrics = cleanedLyrics.replace(/\n\s*\n/g, '\n\n');

        let Embed = new MessageEmbed()
            .setTitle(sarki.title)
            .setDescription(formattedLyrics)
            .setFooter('Pusula', 'https://cdn.discordapp.com/avatars/1123556792870371348/be36a90fc79f98a2d5ad231aa2e3d2d5.png?size=1024')
            .setColor("YELLOW")
            .setThumbnail(song.albumArt);

        if (Embed.description.length >= 2048)
            Embed.description = Embed.description.substr(0, 2042) + "`...`";

        await interaction.followUp({embeds: [Embed] });
    } catch (error) {
        console.error(error);
        await interaction.followUp(hata("Bir hata oluştu: " + error.message));
    }
};

exports.help = {
    name: 'lyrics',
    description: 'Şarkının sözlerini gösterir.',
    options: [],
    category: 'Müzik',
};