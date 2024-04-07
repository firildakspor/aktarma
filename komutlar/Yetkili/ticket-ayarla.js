const { Client, GatewayIntentBits, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageSelectMenu, Permissions } = require("discord.js");
const db = require("croxydb");

exports.run = async (client, interaction) => {
if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply('Bu komutu kullanabilmek için yönetici yetkisine sahip olmalısınız.');  

    const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId(`özelmesaj_${interaction.user.id}`).setLabel("Özel Mesaj").setStyle("SUCCESS"),
        new MessageButton().setCustomId(`özelbuton_${interaction.user.id}`).setLabel("Özel Buton").setStyle("SUCCESS"),
        new MessageButton().setCustomId(`kategori_${interaction.user.id}`).setLabel("Kategori").setStyle("SUCCESS"),
        new MessageButton().setCustomId(`roller_${interaction.user.id}`).setLabel("Rolleri").setStyle("SUCCESS"),
        new MessageButton().setCustomId(`gönder_${interaction.user.id}`).setLabel("Mesajı Gönder").setStyle("DANGER")

    );

    const embed = new MessageEmbed()
        .setTitle("Pusula Ticket Hizmetleri")
        .setDescription(`Özelleştirme için aşağıdaki butonları kullanabilirsiniz.`)
        .setColor("GREEN");

   interaction.reply({ embeds: [embed], components: [row]  })

};

exports.help = {
    name: "ticket-ayarla",
    description: "Ticket mesajı ayarlama komutu.",
    options: [],
};