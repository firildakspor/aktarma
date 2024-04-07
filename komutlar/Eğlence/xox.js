const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

exports.run = async (client, interaction, args) => {
  const opponent = interaction.options.get('rakip').user;

  if (!opponent) {
    return interaction.reply("Oynamak istediğiniz kişiyi etiketleyin!");
  }

  if (opponent.bot) {
    return interaction.reply("Botlarla XOX oynayamazsınız.");
  }

  if (opponent.id === interaction.user.id) {
    return interaction.reply("Kendinizle XOX oynayamazsınız.");
  }
  await interaction.deferReply()

  const embed = new MessageEmbed()
    .setTitle("XOX Oyunu")
    .setDescription(`Sizin için bir XOX teklifi geldi!`)
    .setColor("#0099ff");

  const rowss = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('start')
        .setLabel('Kabul Et')
        .setStyle('PRIMARY')
    );

  interaction.followUp({ content:`<@${opponent.id}>`,embeds: [embed], components: [rowss] }).then(msg => {
    const filter = i => i.customId === 'start' && i.user.id === opponent.id;
    const collector = msg.createMessageComponentCollector({ time: 30000 });

    collector.on('collect', i => {
      if (i.customId === 'start' && i.user.id !== opponent.id) {
        i.reply({ content: `Bu daveti sadece <@${opponent.id}> kabul edebilir.`, ephemeral: true });
        return;
      }

      collector.stop();
      msg.delete();

      // Oyun tahtasını oluşturuyoruz
      const board = Array.from(Array(3), () => new Array(3).fill(":black_large_square:"));

      // Oyunu başlatıyoruz
      const gameEmbed = new MessageEmbed()
        .setTitle("XOX Oyunu")
        .setDescription(`<@${interaction.user.id}> vs. <@${opponent.id}>`)
        .addFields({ name: "Tahta", value: `${printBoard(board)}` })
        .addFields({ name: "Sıra", value: `Sıra: <@${interaction.user.id}> (❌)` })
        .setColor("#0099ff");

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('1')
            .setLabel('1')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('2')
            .setLabel('2')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('3')
            .setLabel('3')
            .setStyle('PRIMARY')
        );

      const row2 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('4')
            .setLabel('4')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('5')
            .setLabel('5')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('6')
            .setLabel('6')
            .setStyle('PRIMARY')
        );

      const row3 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('7')
            .setLabel('7')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('8')
            .setLabel('8')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('9')
            .setLabel('9')
            .setStyle('PRIMARY')
        );

      interaction.channel.send({ embeds: [gameEmbed], components: [row, row2, row3] }).then(msg => {
        const filter = i => (i.customId >= 1 && i.customId <= 9) && (i.user.id === interaction.user.id || i.user.id === opponent.id);
        const collector = msg.createMessageComponentCollector({ filter, time: 300000 });

        let currentPlayer = interaction.user.id;
        let currentSymbol = "❌";

        collector.on('collect', i => {
          if (i.user.id !== currentPlayer) {
            i.reply({ content: 'Sıra size gelmeden hamle yapamazsınız.', ephemeral: true });
            return;
          }

          const move = parseInt(i.customId) - 1;

          if (isValidMove(move, board)) {
            makeMove(move, currentSymbol, board);
            const winner = checkWinner(board);

            if (winner) {
              const winnerName = currentPlayer === interaction.user.id ? interaction.user.id : opponent.id;
              gameEmbed.spliceFields(1, 1, { name: "Sonuç", value: `**<@${winnerName}> (${currentSymbol}) kazandı!**` });
              gameEmbed.setFooter("Oyun bitti.");
              msg.edit({ embeds: [gameEmbed], components: [] });
              collector.stop();
              return;
            } else if (isBoardFull(board)) {
              gameEmbed.spliceFields(1, 1, { name: "Sonuç", value: "**Oyun berabere bitti!**" });
              gameEmbed.setFooter("Oyun bitti.");
              msg.edit({ embeds: [gameEmbed], components: [] });
              collector.stop();
              return;
            }

            currentPlayer = currentPlayer === interaction.user.id ? opponent.id : interaction.user.id;
            currentSymbol = currentSymbol === "❌" ? "⭕" : "❌";

            gameEmbed.spliceFields(1, 1, { name: "Sıra", value: `Sıra: <@${currentPlayer}> (${currentSymbol})` });
            gameEmbed.fields[0].value = printBoard(board);

            msg.edit({ embeds: [gameEmbed], components: [row, row2, row3] });
          }
        });

        collector.on('end', collected => {
          if (collected.size === 0) {
            interaction.channel.send("30 saniye içinde yanıt verilmedi, oyun iptal edildi.");
          }
        });
      });
    });
  });
};

// Tahtayı oluşturan fonksiyon
function printBoard(board) {
  return board.map(row => row.join(" ")).join("\n");
}

// Geçerli hamleyi kontrol eden fonksiyon
function isValidMove(move, board) {
  const row = Math.floor(move / 3);
  const col = move % 3;
  return board[row][col] === ":black_large_square:";
}

// Hamleyi yapmak için fonksiyon
function makeMove(move, symbol, board) {
  const row = Math.floor(move / 3);
  const col = move % 3;
  board[row][col] = symbol;
}

// Kazananı kontrol eden fonksiyon
function checkWinner(board) {
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][0] === board[i][2] && board[i][0] !== ":black_large_square:") {
      return board[i][0];
    }
    if (board[0][i] === board[1][i] && board[0][i] === board[2][i] && board[0][i] !== ":black_large_square:") {
      return board[0][i];
    }
  }
  if (board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] !== ":black_large_square:") {
    return board[0][0];
  }
  if (board[0][2] === board[1][1] && board[0][2] === board[2][0] && board[0][2] !== ":black_large_square:") {
    return board[0][2];
  }
  return null;
}

// Tahta dolu mu kontrolü
function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== ":black_large_square:"));
}
                
exports.help = {
  name: 'xox',
  description: 'Xox oyunu oynatır.',
  options:[{
            name: "rakip",
            description: "İstek gönderilecek kişi.",
            type: 6,
            required: true,
        }]
};
