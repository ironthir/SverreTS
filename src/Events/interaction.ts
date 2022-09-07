import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "../..";
import { ExtendedInteraction } from "../Commands";
import { CommandsCooldown } from "../Typings/ClientTypes";
import { Event } from "../Typings/Events";
export default new Event("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.deferReply();
    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.followUp("You have used a non existent command!");

    const isCommandOnCooldown = client.commandCooldown.some(
      (val: CommandsCooldown) => {
        return (
          JSON.stringify(val) ===
          JSON.stringify({
            userID: interaction.user.id,
            commandUsed: command.name,
          })
        );
      }
    );

    if (isCommandOnCooldown) {
      return interaction.followUp(
        `This comand is currently on cooldown. Wait ${Math.floor(
          command?.cooldown! / (1000 * 60)
        )} minute(s)`.concat(
          command?.cooldown! % 60000 !== 0
            ? ` and ${command?.cooldown! % 60000} second(s)`
            : ""
        )
      );
    }
    await command.run({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as ExtendedInteraction,
    });
    if (command.cooldown) {
      client.commandCooldown.push({
        userID: interaction.user.id,
        commandUsed: command.name,
      });
      setTimeout(() => {
        client.commandCooldown.splice(0, 1, {
          userID: interaction.user.id,
          commandUsed: command.name,
        });
      }, command.cooldown);
    }
  }
});
