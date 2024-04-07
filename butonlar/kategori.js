const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    run: async (client, interaction, kullanici) => {
        if (kullanici !== interaction.user.id) return;

        const guild = interaction.guild;
        const categoryChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY');

        const categoryOptions = categoryChannels.map(category => {
            return {
                label: category.name,
                value: category.id,
            };
        });

        const selectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('kategorisecim')
                    .setPlaceholder('Bir kategori seçin...')
                    .addOptions(categoryOptions),
            );

        await interaction.reply({
            ephemeral: true,
            content: 'Lütfen bir kategori seçin:',
            components: [selectMenu],
        });
    }
};