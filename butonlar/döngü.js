const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    run: async (client, interaction, kullanici) => {
       

      const args = [];
      const commandName = "döngü";

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
    run.run(client, interaction,args);
    }
}