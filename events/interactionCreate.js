const { MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const axios=require('axios')
let talkedRecently = new Set();
  function ilkHarfiBuyut(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const db=require('croxydb')
module.exports = async (client, interaction) => {
const requiredPermissions = [
    'SEND_MESSAGES',
    'CONNECT',
    'SPEAK',
    'USE_EXTERNAL_EMOJIS',
    'EMBED_LINKS' ,
];

if (!interaction.channel) return interaction.reply(`Lütfen botu sunucu kanallarında kullanın.`);
const memberPermissions = interaction.guild.members.me.permissions.serialize();
const missingPermissions = [];

requiredPermissions.forEach(permission => {
    if (!memberPermissions[permission]) {
        missingPermissions.push(permission);
    }
});

if (missingPermissions.length > 0) return interaction.reply(`Botun eksik izinleri bulunuyor: ${missingPermissions.join(', ')}. Bu izinlerden herhangi biri açık olmadan botu kullanamazsınız.`);

  //  if (talkedRecently.has(interaction.user.id)) {
//    return interaction.reply({content:"Butonları kullanmak için biraz bekle.",ephemeral:true})
//  }
  talkedRecently.add(interaction.user.id);
  setTimeout(() => {
    talkedRecently.delete(interaction.user.id);
  }, 2000);

 if(interaction.type == "APPLICATION_COMMAND"){
      
      const command = client.commands.get(interaction.commandName);
const konum = command.konum
   
    if(!konum) {
        return console.error(`${interaction.commandName} --> Böyle bir komutum yok.`)
    }

      try {
        const run = require(`.${konum}`)
   await run.run(client, interaction);
  } catch (error) {
    console.error(error);
  }
   } else if (interaction.isSelectMenu()) {
     
     if(!client.channels.cache.get(interaction.channel.id)) return
     const selectedValue = interaction.values[0];
  if (interaction.customId.startsWith('kategoriler')) {
        const selectedCategory = interaction.values[0]
        const fs = require('fs');
console.log(selectedCategory)

  const commandFiles = client.commands
  const commands = commandFiles.map(file => {
    return {
      name: `${file.name}`,
      description: file.description,
      category: ilkHarfiBuyut(file.category) // Kategori bilgisini ekledik
    };
  });

  const filteredCommands = commands.filter(command => command.category === selectedCategory );
console.log(filteredCommands)
  
               const selectedCategoryEmbed = new MessageEmbed().setTitle(`**${selectedCategory} Komutları**`)
  .setColor('YELLOW')
    	.setFooter({ text: 'Pusula', iconURL: 'https://cdn.discordapp.com/avatars/1123556792870371348/be36a90fc79f98a2d5ad231aa2e3d2d5.png?size=1024' });
    filteredCommands.forEach(command => {

       selectedCategoryEmbed.addFields({
             name: `/${command.name}`,
             value: ` ${command.description}`
            });
        })
      interaction.reply({embeds: [selectedCategoryEmbed], ephemeral: true })
      
  
  

        }  else if(interaction.customId.startsWith('kategorisecim')){
                 const selectedValue = interaction.values[0];
db.set(`ticket_${interaction.guild.id}.kategori`, selectedValue)


    interaction.reply({content:"Ticket kategorisi başarıyla ayarlandı.",ephemeral:true})    
          
        } else if(interaction.customId.startsWith('rolsecim')){
             if(db.get(`ticket_${interaction.guild.id}.roller`)) db.delete(`ticket_${interaction.guild.id}.roller`)
      const i =interaction.values
      for (const a in i) {
        db.push(`ticket_${interaction.guild.id}.roller`, i[a])
      }
    interaction.reply({content:"Kanalı görebilecek roller başarıyla ayarlandı.",ephemeral:true})  
        }
      
        
   } else if(interaction.isButton()) {

      const veri = interaction.customId;
var parcalanmisVeri = veri.split('_');
  
var customId = parcalanmisVeri[0];
var id = parcalanmisVeri[1] || ''; // Eğer üçüncü kısım yoksa boş string olarak ayarlar

 const fs = require('fs');
const path = require('path');

const klasorYolu = './butonlar'; // Klasör yolunu ayarlayın

const dosyaYolu = path.join(klasorYolu, `${customId}.js`);

// Dosya var mı kontrol et
fs.access(dosyaYolu, fs.constants.F_OK, (err) => {
  if (!err) {
  const command = require(`../butonlar/${customId}.js`);
   command.run(client, interaction, id);  } else {
return
  }
});
     
    
    


   } else if (interaction.isModalSubmit()) {
    if (interaction.customId == "myModal") {

      const metin = interaction.fields.getTextInputValue("sarkical");
      const args = metin
      const commandName = "oynat";

      const command =
        client.commands.get(commandName) ||
        client.commands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );
const konum = command.konum
    if(!konum) {
        return console.error(`${interaction.commandName} --> Böyle bir komutum yok.`)
    }

        const run = require(`.${konum}`)
    run.run(client, interaction, args);

    } else if (interaction.customId.startsWith("özelbutonayarla")){
      
        const isim = interaction.fields.getTextInputValue("metin2");
        const emojiNameOrId= interaction.fields.getTextInputValue("metin1");
            if(emojiNameOrId){
          const emoji = client.emojis.cache.find(emoji => emoji.name === emojiNameOrId || emoji.id === emojiNameOrId)

 if(!emoji) return send(`Böyle bir emoji ismi ya da ID'si bulamadım.`, interaction);
 db.set(`ticket_${interaction.guild.id}.özel-ticket-buton-emoji`,emoji.id)
            }
db.set(`ticket_${interaction.guild.id}.özel-ticket-buton`, isim)
              send(`Buton başarıyla ${isim} olarak ayarlandı.`, interaction);

   
      
    } else if (interaction.customId.startsWith("özelmesajayarla")){
       const isim = interaction.fields.getTextInputValue("metin2");
db.set(`ticket_${interaction.guild.id}.özel-ticket-mesaj`, isim)
              send(`Mesaj başarıyla ${isim} olarak ayarlandı.`, interaction);


    }
  } 
};


function send(messageContent, interaction) {
  const embedMessage = new MessageEmbed()
    .setTitle("Pusula")
    .setColor("#F0FFFF")
    .setDescription(messageContent);

  interaction.reply({ embeds: [embedMessage], ephemeral: true });
}