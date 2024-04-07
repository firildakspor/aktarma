const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    run: async (client, interaction, kullanici) => {
        if (kullanici !== interaction.user.id) return;

        const guild = interaction.guild;
        const roles = guild.roles.cache.map(role => {
            return {
                label: `@${role.name}`,
                value: role.id,
            };
        });

        let maxValues = roles.length > 25 ? 25 : roles.length;

        const selectMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('rolsecim')
                    .setPlaceholder('Bir rol seçin...')
                    .setMinValues(1)
                    .setMaxValues(parseInt(maxValues))
                    .addOptions(roles.slice(0, maxValues)), // Yalnızca ilk 25 rolü göster
            );

        await interaction.reply({
            ephemeral: true,
            content: 'Lütfen bir rol seçin:',
            components: [selectMenu],
        });
    }
};