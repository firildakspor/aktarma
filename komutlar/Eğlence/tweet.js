const Discord = require("discord.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
const Canvas = require('canvas');
const axios = require('axios');
const { MessageActionRow, MessageButton } = require('discord.js');

exports.run = async (client, interaction, args) => {
await interaction.deferReply()
  let outputArray = [];
  let content = interaction.options.get('metin').value;

  // Emoji kontrolü ve yerleştirme
  const emojiRegex = /<a?:.+:\d+>/g;
  const emojiMatches = content.match(emojiRegex);
  let emojiler = [];
  if (emojiMatches) {
    for (const emojiMatch of emojiMatches) {
      content = content.replace(emojiMatch, '');
    }
  }
  if (emojiMatches) {
    let regex = /<[^>]+>/g;
    let matches = emojiMatches[0].match(regex);

    // Her eşleşen değeri outputArray'e eklemek
    matches.forEach(match => {
      outputArray.push(match);
    });
  }
  // Metni boşluklara göre ayırarak kelimeleri içeren bir dizi oluşturma
  const karakterSayisi = content.length;
  if (karakterSayisi > 130) {
    interaction.reply(`Karakter limitini aştınız! (${content.length}/130)`).then((sentMessage) => {
      // 10 saniye sonra gönderilen mesajı sil
      setTimeout(() => {
        sentMessage.delete();
      }, 3000);
    });
    return;
  }
  const canvas = Canvas.createCanvas(1100, 1000);
  const context = canvas.getContext('2d');

  const ayarlar = require("/app/ayarlar.json");
  const allowedUsers = ayarlar.owner;
  if (allowedUsers.includes(interaction.user.id)) {
    const backgroundImage = await loadImage('https://cdn.discordapp.com/attachments/1126254633510252755/1132021306011959366/IMG_20230716_194516_2.jpg');
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  } else {
    const backgroundImage = await loadImage('https://cdn.discordapp.com/attachments/1124673016316559360/1132008451975946360/IMG_20230716_194516_2.jpg');
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  // Arka plan resmini çiz

  // Metni ayarla
  const maxWidth = 150; // Metnin maksimum genişliği
  const lineHeight = 80; // Satır başına düşen yükseklik
  const startX = 25; // Metnin başlangıç X koordinatı
  let startY = 395; // Metnin başlangıç Y koordinatı

  // Metni parçalara bölmek
  const metin = content;
  const kelimeler = metin.split(' ');
  let satir = '';

  kelimeler.forEach(function (kelime) {
    if ((satir + kelime).length > 27) {
      context.fillStyle = '#0e1211';
      context.font = '70px Chirp'; // Metnin boyutunu 70 piksel olarak ayarlar
      context.fillText(satir, startX, startY); // Önceki satırı çiz
      startY += lineHeight; // Yeni satır için Y koordinatını artır;
      satir = kelime;
    } else {
      satir += (satir === '' ? '' : ' ') + kelime;
    }
  });

  context.fillStyle = '#0e1211';
  context.font = '70px Chirp'; // Metnin boyutunu 70 piksel olarak ayarlar
  context.fillText(satir, startX, startY); // Önceki satırı çiz

  const avatarURL = await loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));

  // Avatarı daire şeklinde çiz
  const avatarSize = 110; // Avatar boyutu
  const avatarX = 25; // Avatarın X koordinatı
  const avatarY = 165; // Avatarın Y koordinatı
  context.save();
  context.beginPath();
  context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();
  context.drawImage(avatarURL, avatarX, avatarY, avatarSize, avatarSize);
  context.restore();

  context.fillStyle = '#0e1211';
  context.font = 'bold 50px Chirp'; // Metnin boyutunu 50 piksel olarak ayarlar
  context.fillText(interaction.user.username, 150, 219); // Önceki satırı çiz

  context.fillStyle = '#7f888f';
  context.font = '50px Chirp'; // Metnin boyutunu 50 piksel olarak ayarlar
  context.fillText(`@${interaction.user.tag.toLowerCase()}`, 145, 269); // Önceki satırı çiz

  const now = new Date();
  const options = { timeZone: 'Europe/Istanbul', hour12: false };
  const timeString = now.toLocaleTimeString('tr-TR', options).slice(0, -3); // Saniye bilgisini silmek için slice kullanılır

  const options2 = { day: '2-digit', month: 'short', year: '2-digit' };
  const date = now.toLocaleDateString('tr-TR', options2).replace(/ /g, ' ').toLowerCase();

  const veriler = ['𝟮𝟮𝗕', '𝟭𝟬𝗕', '𝟮𝟮𝟬𝗕', '𝟳', '𝟴𝗠', '𝟭𝟱𝗠', '𝟭𝟯𝟱𝗠', '𝟱𝟭𝟲𝗠', '𝟭.𝟮𝗠𝗥', '𝟬'];
  const veriler2 = ['𝟰𝟮𝟳', '𝟮𝟬𝟭', '𝟭.𝟮𝟬𝟰', '𝟭', '𝟳𝟱.𝟯𝗕', '𝟭𝟲𝟵.𝟯𝗕', '𝟳.𝟱𝗠', '𝟭𝟴.𝟯𝗠', '𝟭𝟬𝟮.𝟵𝗠', '𝟬'];
  const veriler3 = ['𝟯𝟲𝟴', '𝟯𝟭𝟰', '𝟭.𝟴𝟰𝟳', '𝟮', '𝟭𝟬𝟰.𝟲𝗕', '𝟮𝟱𝟲.𝟯𝗕', '𝟱.𝟯𝗠', '𝟭𝟱.𝟯𝗠', '𝟲𝟬.𝟭𝗠', '𝟬'];
  const veriler4 = ['𝟴.𝟵𝟳𝟰', '𝟮.𝟰𝟳𝟵', '𝟱𝟲.𝟯𝗕', '𝟯', '𝟭.𝟮𝗠', '𝟭.𝟰𝗠', '𝟯𝟱.𝟭𝗠', '𝟭𝟬𝟭.𝟵𝗠', '𝟱𝟲𝟭.𝟰𝗠', '𝟬'];

  const randomIndex = Math.floor(Math.random() * veriler.length);
  const randomVeri = veriler[randomIndex];
  const selectedVeriler2 = veriler2[randomIndex];
  const selectedVeriler3 = veriler3[randomIndex];
  const selectedVeriler4 = veriler4[randomIndex];

  context.fillStyle = '#7f888f';
  context.font = '50px Chirp'; // Metnin boyutunu 50 piksel olarak ayarlar
  context.fillText(`${timeString} • ${date} • ${randomVeri} Görüntülenme`, 25, 819); // Önceki satırı çiz

  context.fillStyle = '#7f888f';
  context.font = '35px Chirp'; // Metnin boyutunu 50 piksel olarak ayarlar
  context.fillText(`${selectedVeriler2} Retweet ${selectedVeriler3} Alıntılar ${selectedVeriler4} Beğeni`, 25, 925); // Önceki satırı çiz

  // Emoji kontrolü ve yerleştirme
  if (emojiMatches) {
    let emojiX = startX;
    let emojiY = startY+20;
    for (let i = 0; i < outputArray.length; i++) {
      const emojiMatch = outputArray[i];
      const emojiParts = emojiMatch.split(':');
      const emojiID = emojiParts[emojiParts.length - 1].replace('>', '');

      try {
        const emojiResponse = await axios.get(`https://cdn.discordapp.com/emojis/${emojiID}`);
        const emojiImage = await loadImage(emojiResponse.request.res.responseUrl);
        const emojiSize = 70; // Emoji boyutu
        context.drawImage(emojiImage, emojiX, emojiY, emojiSize, emojiSize);

        emojiX += emojiSize + 5; // Emoji'ler arasında 5 birimlik boşluk bırakmak için
      } catch (error) {
        console.error(`Emoji yüklenirken bir hata oluştu: ${error}`);
      }
    }
  }

  const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(`silgi_${interaction.user.id}`)
            .setLabel('Sil')
            .setStyle('SECONDARY')
           .setEmoji("1131615830510153748") 

    );
  
  // Canvas'ı Discord'a gönder
  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'tweet.png');
  const tweetMessage = await interaction.followUp({ files: [attachment], components: [row] });

};

exports.help = {
  name: "tweet",
  description: "Twitter'daki gibi tweet atarsınız.",
    options:[{
            name: "metin",
            description: "Tweet metni girin.",
            type: 3,
            required: true,
        }]

};
