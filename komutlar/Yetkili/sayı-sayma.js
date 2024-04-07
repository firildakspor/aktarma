const Discord = require("discord.js");
const db = require('croxydb'); // creating database
db.setReadable(true) // It makes readable your JSON DB file.
const { Permissions } = require('discord.js');
exports.run = async (client, interaction) => {
 
if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply('Bu komutu kullanabilmek için yönetici yetkisine sahip olmalısınız.');  
    await interaction.deferReply()
   const kanal = interaction.options.get('kanal')
   if(!kanal) return;
  if(kanal.channel.type !=="GUILD_TEXT") return interaction.reply("Bir yazı kanalı girmelisiniz.")
db.set(`${interaction.guild.id}.sayisayma.kanal`, kanal.value)
db.set(`${interaction.guild.id}.sayisayma.sayi`, 1)


    await interaction.followUp("Sayı sayma kanalı başarıyla ayarlandı.")
};

exports.help = {
  name: "sayı-sayma",
  description: "Sayı Sayma Kanalını Ayarlarsınız.",
options:[{
            name: "kanal",
            description: "kanal",
            type: 7,
            required: true,
        }]
};
