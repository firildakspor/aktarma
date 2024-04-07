const Discord =require('discord.js')
const { MessageEmbed,MessageButton,MessageActionRow } =require('discord.js')
module.exports.run = async (client, interaction, arg) => {
      await interaction.deferReply({ephemeral:true})

const ayarlar = require("/app/ayarlar.json");
  const allowedUsers = ayarlar.owner;
  if (!allowedUsers.includes(interaction.user.id)) return await interaction.followUp("Bu komudu yetkisi olanlar kullanabilir.");
let args;
  if(interaction.options){
args = interaction.options.get('kod').value;
  } else {args=arg}
  
const message=interaction

  const evalbuton = new MessageButton()
    .setStyle('DANGER')
    .setLabel('Tekrar Dene')
    .setCustomId(encodeURIComponent(`eval_${args}`));

  const row = new MessageActionRow().addComponents(evalbuton );
  
  
    try {
      var code = args
      var evaled = eval(code);
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      let Embed = new MessageEmbed()
                            .addFields({name:"Giriş",value:"```js\n" + code + "```"})
                            .setDescription("```js\n" + clean(evaled) + "```")
if (Embed.description.length >= 2048)
      Embed.description = Embed.description.substr(0, 2042) + "```...";
    return await interaction.followUp({ephemeral:true, embeds:[Embed], components: [row]})
    } catch (err) {
        let hata = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(`\`\`\`xl\n${clean(err)}\n\`\`\``)
    return await interaction.followUp({ephemeral:true, embeds:[hata], components: [row]})
    }
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
 };

exports.help = {
  name: 'eval',
  description: 'Yetkili özel kod',
  options:[{
            name: "kod",
            description: "Kod",
            type: 3,
            required: true,
        }],
  category: 'Özel'
};