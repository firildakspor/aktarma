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
  const randomTurkishLetter = getRandomTurkishLetter();

db.set(`${interaction.guild.id}.kelimetüretmece.kanal`, kanal.value)
db.set(`${interaction.guild.id}.kelimetüretmece.sonharf`, randomTurkishLetter.toLocaleLowerCase('tr-TR'))


    await interaction.followUp("Oyun Başlatıldı! İlk harfimiz: "+randomTurkishLetter)
};

exports.help = {
  name: "kelime-türetmece",
  description: "Kelime Türetmece Kanalını Ayarlarsınız.",
options:[{
            name: "kanal",
            description: "kanal",
            type: 7,
            required: true,
        }]
};
function getRandomTurkishLetter() {
  const turkishLetters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
  const randomIndex = Math.floor(Math.random() * turkishLetters.length);
  return turkishLetters[randomIndex];
}