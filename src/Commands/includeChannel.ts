import { TextChannel } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { prisma } from "../..";

import { Command } from "../Commands";

export default new Command({
  name: "includechannel",
  description: "Allows gaining experience and money on a channel",

  defaultMemberPermissions: "ADMINISTRATOR",
  options: [
    {
      name: "channel",
      description: "channel to include",
      type: "CHANNEL",
      channelTypes: [ChannelTypes.GUILD_TEXT],
    },
  ],
  run: async ({ interaction }) => {
    const temp = await interaction.options.getChannel("channel");

    const channel: TextChannel = temp as TextChannel;
    try {
      const row = await prisma.exclude_moneyandexperience.findFirst({
        where: { serverid: channel.guildId, channelid: channel.id },
      });
      await prisma.exclude_moneyandexperience.delete({
        where: {
          id: row?.id,
        },
      });
      interaction.followUp(
        `${channel.name} was successfully included for gaining experience and money!`
      );
    } catch (err) {
      interaction.followUp(
        "An unexpected error occured when trying to exclude the channel."
      );
    }
  },
});
