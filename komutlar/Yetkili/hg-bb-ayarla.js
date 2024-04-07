const Discord = require("discord.js");
const db = require('croxydb'); // creating database
db.setReadable(true) // It makes readable your JSON DB file.
const { Permissions } = require('discord.js');
const {MessageActionRow,MessageButton} =require('discord.js')
const ayarlar = require("/app/ayarlar.json");
exports.run = async (client,interaction) => {
  
   const kanal = interaction.options.get('kanal')
   if(!kanal) return;
  if(kanal.channel.type !=="GUILD_TEXT") return interaction.reply("Bir yazı kanalı girmelisiniz.")
   console.log(kanal.channel.type)
if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply('Bu komutu kullanabilmek için yönetici yetkisine sahip olmalısınız.');  
 db.set(`${interaction.guild.id}.hg-bb.kanal`, kanal.value)

  interaction.reply("Kayıt kanalı başarıyla ayarlandı.")
};

exports.help = {
  name: "hg-bb",
  description: "Resimli HG-BB Kanalını Ayarlarsınız.",
  options:[{
            name: "kanal",
            description: "kanal",
            type: 7,
            required: true,
        }],
  category: "Yetkili Komutları" // Yardım kategorisine ait olduğunu belirttik
};
