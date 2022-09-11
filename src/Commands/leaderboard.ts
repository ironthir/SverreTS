import { Message, MessageEmbed, Permissions } from "discord.js";
import { APIMessage } from "discord.js/node_modules/discord-api-types/v10";
import { Command } from "../Commands";

export default new Command({
  name: "leaderboard",
  description: "Replies with a link to server's leaderboard",

  run: async ({ interaction }) => {
    const leaderboardEmbed = new MessageEmbed({
      title: `Leaderboard for ${interaction.guild?.name}`,
      color: "RED",
      url: `https://sverre-ts-ironthir.vercel.app/Leaderboards/${interaction.guild?.id}`,
    })
      .setTimestamp()
      .setThumbnail(
        `https://cdn.discordapp.com/icons/${interaction.guild?.id}/${interaction.guild?.icon}`
      )
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      });

    await interaction.followUp({ embeds: [leaderboardEmbed] });
  },
});
