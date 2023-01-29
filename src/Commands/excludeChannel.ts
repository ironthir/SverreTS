import { TextChannel } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { prisma } from "../..";

import { Command } from "../Commands";

export default new Command({
  name: "excludechannel",
  description:
    "Prevents users from getting experience and money from writing on a given channel",

  defaultMemberPermissions: "ADMINISTRATOR",
  options: [
    {
      name: "channel",
      description: "channel to exlude",
      type: "CHANNEL",
      channelTypes: [ChannelTypes.GUILD_TEXT],
    },
  ],
  run: async ({ interaction }) => {
    const temp = await interaction.options.getChannel("channel");

    const channel: TextChannel = temp as TextChannel;
    try {
      await prisma.exclude_moneyandexperience.create({
        data: {
          serverid: channel.guildId,
          channelid: channel.id,
        },
      });
      interaction.followUp(
        `${channel.name} was successfully excluded from gaining experience and money!`
      );
    } catch (err) {
      interaction.followUp(
        "An unexpected error occured when trying to exclude the channel."
      );
    }
  },
});
