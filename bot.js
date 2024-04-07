const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,],});
const moment = require('moment');
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const db = require('croxydb');
const axios=require('axios')
const canvafy =require('canvafy')

client.queue = new Map();
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomTurkishLetter() {
  const turkishLetters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
  const randomIndex = Math.floor(Math.random() * turkishLetters.length);
  return turkishLetters[randomIndex];
}
// -------------- Event Yükleme --------------

client.commands = new Collection();

const loadEvents = (dir) => {
  const eventFiles = fs.readdirSync(`./${dir}`).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(`./${dir}/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./${dir}/${file}`)];
  }
}

loadEvents('events');

// -------------- Slash Komutları --------------

const slashCommandsRegister = () => {
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v10");

    client.once("ready", async() => {
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
      try {
        await rest.put(Routes.applicationCommands(process.env.clientID), {
          body: client.commands,
        }).then(() => {
            console.info(`Kayıt edilen komut sayısı: ${client.commands.size}`)
        });
      } catch (error) {
        throw error;
      }
    });
} 

slashCommandsRegister();

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
fs.readdir("./komutlar/", (err, categories) => {
  if (err) console.error(err);     
   categories.forEach(klasor => {
fs.readdir(`./komutlar/${klasor}/`, (err, files) => {
files.forEach(f => {
const cmd = require(`./komutlar/${klasor}/${f}`);
const durum ={
       name:cmd.help.name,
       description:cmd.help.description,
       options:cmd.help.options,
       category:klasor,
       konum:`./komutlar/${klasor}/${f}`
     }
         
        client.commands.set(cmd.help.name, durum)
        log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Yüklenen Slash komutu: ${cmd.help.name}`)
      }); 
    });
  });
})

// -------------- Prefix Komutları --------------


/*client.commands = new Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} prefix komutu yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen Prefix komutu: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
  });
});
*/
client.login(process.env.TOKEN);

// -------------- Resimli HG BB --------------


client.on('guildMemberAdd', async(member) => {
  const kanal=db.get(`${member.guild.id}.hg-bb.kanal`)
if(!kanal) return
  const channel = member.guild.channels.cache.get(kanal)
  if (!channel) return;
  const avatar= member.displayAvatarURL({ size: 300, dynamic: true });

    const cizim = await new canvafy.WelcomeLeave()
.setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
.setBackground("image", "https://cdn.discordapp.com/attachments/1157704345895317585/1168203699747819670/1ca72347a453e7cf2718e9c7de7dc49f-1.webp?ex=6550e97a&is=653e747a&hm=367981c80066f9c913580585c1f386b3576704a806fef9d8df075d9de0f07c03")
.setTitle(member.user.username)
.setDescription(`Sunucumuza hoş geldiniz.`) 
.setBorder("#2a2e35")
.setAvatarBorder("#2a2e35")
.setOverlayOpacity(0.3)
.build();
  
channel.send({
    files: [{
        attachment: cizim,
        name: 'hg.png'
    }],
});});

client.on('guildMemberRemove', async(member) => {
  const kanal=db.get(`${member.guild.id}.hg-bb.kanal`)
if(!kanal) return
  const channel = member.guild.channels.cache.get(kanal)
  if (!channel) return;
  const avatar= member.displayAvatarURL({ size: 300, dynamic: true });
    const cizim = await new canvafy.WelcomeLeave()
.setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
.setBackground("image", "https://cdn.discordapp.com/attachments/1157704345895317585/1168203699747819670/1ca72347a453e7cf2718e9c7de7dc49f-1.webp?ex=6550e97a&is=653e747a&hm=367981c80066f9c913580585c1f386b3576704a806fef9d8df075d9de0f07c03")
.setTitle(member.user.username)
.setDescription(`Güle Güle!`) 
.setBorder("#2a2e35")
.setAvatarBorder("#2a2e35")
.setOverlayOpacity(0.3)
.build();
  channel.send({
    files: [{
        attachment: cizim,
        name: 'bb.png'
    }],
    
});});

// -------------- Hercai Konuşturma --------------

client.on("messageCreate", async (message) => {
  const botMention = `<@${client.user.id}>`; // Botun etiketi
  
   let question;
  
  if (message.content.includes(botMention)) {
      question = message.content.replace(botMention, "").trim();
    } else {
      question = message.content.replace(client.user.username, "").trim();
    }
  

  if (message.content.includes(botMention) || message.content.includes(client.user.username)) {
   

    // encodeURIComponent ile URL uyumlu hale getir
    const encodedQuestion = encodeURIComponent(`${question}? benim ismim: ${message.author.username}`);

    const url = `https://uneven-sequoia-lingonberry.glitch.me/hercai/?soru=${encodedQuestion}`;

    try {
      const cevap = await axios.get(url);
      console.log(cevap.data)
      message.channel.send({
        content: cevap.data,
      });
    } catch (error) {
      console.error("Resim alınırken bir hata oluştu:", error);
    }
  }

});

// -------------- Sayı Saymaca --------------

client.on("messageCreate", async (message) => {
  if(message.author.bot) return
if(message.channel.id==db.get(`${message.guild.id}.sayisayma.kanal`)) {
const sayi = db.get(`${message.guild.id}.sayisayma.sayi`)
if(db.get(`${message.guild.id}.sayisayma.sonadam`) == message.author.id){
      const msg= await message.reply(`Lütfen üst üste sayı saymaya çalışmayın.`) 
      await delay(5000); // 5 saniye bekleyin
      message.delete()   
      msg.delete()
       return
   }
  
if(sayi==message.content) {
  message.react("1162415030734688278")
  db.add(`${message.guild.id}.sayisayma.sayi`, 1)
    db.set(`${message.guild.id}.sayisayma.sonadam`, message.author.id)

} else { 
      const msg= await message.reply(`Sıradaki sayı: ${sayi}`) 
      await delay(5000); // 5 saniye bekleyin
      message.delete()
      msg.delete()
       return
       }
}
});
// -------------- Kelime Türetmece --------------

client.on("messageCreate", async (message) => {
  const msj=message.content.toLocaleLowerCase('tr-TR');
  if(message.author.bot) return
if(message.channel.id==db.get(`${message.guild.id}.kelimetüretmece.kanal`)) {
const sayi = db.get(`${message.guild.id}.kelimetüretmece.sonharf`)
if(db.get(`${message.guild.id}.kelimetüretmece.sonadam`) == message.author.id){

      const msg= await message.reply(`Lütfen üst üste yazı yazmaya çalışmayın.`) 
      await delay(5000); // 5 saniye bekleyin
      message.delete()
      msg.delete()
       return
   }
  if(msj.startsWith(sayi)){
    
    const kotr = require("kelime-oyunu-tr")

   const kontrol= await kotr(msj)

      if(kontrol.sebep){
        if(kontrol.sebep == "Kelimenin kökeni türkçce değil.") { 
        } else {
          const msg= await message.reply(`Geçerli bir kelime söyleyin.`) 
          await delay(5000); // 5 saniye bekleyin
      message.delete()
      msg.delete()
          return
      }
    }
    
    let sonHarf = msj.slice(-1);
    if(sonHarf=="ğ" || sonHarf=="Ğ") {
      sonHarf=getRandomTurkishLetter()
        message.channel.send("Son harf Ğ olduğundan dolayı yeni bir harf seçiliyor:" +sonHarf)

    }
db.set(`${message.guild.id}.kelimetüretmece.sonharf`, sonHarf.toLocaleLowerCase('tr-TR'))
  message.react("1162415030734688278")
    db.set(`${message.guild.id}.kelimetüretmece.sonadam`, message.author.id)

} else { 
      const msg= await message.reply(`Şu harfle başlayın: ${sayi}`) 
      await delay(5000); // 5 saniye bekleyin
      message.delete()
      msg.delete()
       return
       }
}
});
// -------------- Kanaldan Oto Çıkma --------------

client.on('voiceStateUpdate', (oldState, newState) => {
 let timeout

 if (oldState.channel && oldState.channel.members.size === 1 && oldState.channel.members.has(client.user.id)) {
 const queueConstruct = client.queue.get(oldState.guild.id)
//if(queueConstruct)client.channels.cache.get(queueConstruct.textChannel).send("10 saniye içinde kanala bir katılım olmazsa kanaldan ayrılacağım")
 if(oldState.guild.id==="1139817971989098506") return console.log("sa")
 timeout = setTimeout(() => {
            // Kanal hala boşsa botu kanaldan çıkar
            if (oldState.channel && oldState.channel.members.size === 1 && oldState.channel.members.has(client.user.id)) {
                oldState.guild.members.me.voice.disconnect();
              if(queueConstruct) client.queue.delete(oldState.guild.id)
            }
        }, 10000); // 10 saniye
    } else {
        // Eğer kanalda tekrar en az iki kişi varsa ve bekleme süresi devam ediyorsa, beklemeyi iptal et
        if (timeout) {
           const queueConstruct = client.queue.get(oldState.guild.id)
          if(queueConstruct)client.channels.cache.get(queueConstruct.textChannel).send("Kanala katılım oldu. Devam ediliyor.")

            clearTimeout(timeout);
            timeout = null;
        }
    }
});


// -------------- Siteyi Yükleme --------------


const express = require("express");
const app = express();
app.set('view engine', 'ejs');

// .ejs dosyalarını içeren views klasörünü ayarlayın.
app.set('views', __dirname + '/views');

app.get("/", (request, response) => {
response.redirect("/terms")
});
app.get("/terms", (req, res) => {
  res.render('terms', { title: 'Pusula Hizmet Şartları' });

});
app.get("/privacy-policy", (req, res) => {
  res.render('privacy-policy', { title: 'Pusula Gizlilik Politikası' });

});

app.listen(parseInt(process.env.PORT))

// -------------- Hataları Bildirme --------------

  
process.on("uncaughtException", (error) => {
  console.error("Beklenmeyen Hata:");
  console.error(error);

  const errorMessage = `Beklenmeyen Hata:\n\`\`\`Message: ${error.message}\nStack Trace: ${error.stack}\`\`\``;
  sendErrorMessage(errorMessage, "https://discord.com/api/webhooks/1136385028788605118/nouFzG_ba-S9wpmP4jr0brpBW0d6DPsA5n-nt-t8F0kDQX3W1Brm5-o9ccxHw8V8dVDh");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("İşlenmeyen Reddedilen Promise:");
  console.error(reason)
    console.error(promise.stack)

  const errorMessage = `İşlenmeyen Reddedilen Promise:\n\`\`\`Reason: ${reason}\`\`\`   `;
  sendErrorMessage(errorMessage,"https://discord.com/api/webhooks/1136385028788605118/nouFzG_ba-S9wpmP4jr0brpBW0d6DPsA5n-nt-t8F0kDQX3W1Brm5-o9ccxHw8V8dVDh");
});

function sendErrorMessage(errorMessage, webhookURL) {
  axios.post(webhookURL, {
    content: errorMessage,
  })
  .catch((error) => {
    console.error("Hata mesajı gönderilirken bir hata oluştu:");
    console.error(error);
  });
}
