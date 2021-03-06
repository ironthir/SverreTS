import { Message, MessageEmbed, Permissions } from "discord.js";
import { APIMessage } from "discord.js/node_modules/discord-api-types/v10";
import { Command } from "../Commands";

export default new Command({
  name: "votekick",
  description: "Launches a vote to kick a member of the server",
  cooldown: 300000,
  options: [
    {
      name: "user",
      description: "member to kick",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "reason to kick",
      type: "STRING",
      required: false,
    },
  ],
  run: async ({ interaction }) => {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const member = interaction.guild?.members.cache.get(user?.id!);

    if (!member) return;
    if (member.user.bot) {
      interaction.followUp("We don't do that here");
      return;
    }
    if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      interaction.followUp("You can't kick administrators");
      return;
    }

    const votekickEmbed = new MessageEmbed({
      title: `You are kicking ${member.displayName}`,
      color: "RED",
      description: "Three minutes to vote, vote advantage of three is needed!",
    })
      .setTimestamp()
      .setThumbnail(user?.displayAvatarURL()!)
      .addFields({ name: "Reason", value: reason ? reason : "No reason" })
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL(),
      });

    await interaction.followUp({ embeds: [votekickEmbed], fetchReply: true });
    const voteEmbed: Message =
      (await interaction.fetchReply()) as unknown as Message;
    if (!voteEmbed) return;

    voteEmbed.react("✅");
    voteEmbed.react("❌");
    let votesYes: number = voteEmbed.reactions.cache.get("✅")?.count!;
    let votesNo: number = voteEmbed.reactions.cache.get("❌")?.count!;
    setTimeout(() => {
      if (votesYes > votesNo && votesYes - votesNo >= 3) {
        member.kick();
        const afterkicking = new MessageEmbed()
          .setColor("RED")
          .setTitle("We kicked " + member.displayName)
          .setThumbnail(member.displayAvatarURL())
          .addFields({
            name: "Reason",
            value: reason ? reason : "No reason",
          })
          .setDescription("Nobody will miss them")
          .setTimestamp();
        interaction.followUp({ embeds: [afterkicking] });
      } else {
        const notKicked = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("You are safe " + member.displayName)
          .setThumbnail(member.displayAvatarURL())
          .setDescription("For now...")
          .setTimestamp();
        interaction.followUp({ embeds: [notKicked] });
      }
    }, 180000);
  },
});
