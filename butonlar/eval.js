module.exports = {
    run: async (client, interaction, deger) => {
     

      const commandName = "eval";

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
    run.run(client, interaction, decodeURIComponent(deger));
      
    }
}