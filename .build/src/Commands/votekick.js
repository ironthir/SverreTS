"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var votekick_exports = {};
__export(votekick_exports, {
  default: () => votekick_default
});
module.exports = __toCommonJS(votekick_exports);
var import_discord = require("discord.js");
var import_Commands = require("../Commands");
var votekick_default = new import_Commands.Command({
  name: "votekick",
  description: "Launches a vote to kick a member of the server",
  cooldown: 3e5,
  options: [
    {
      name: "user",
      description: "member to kick",
      type: "USER",
      required: true
    },
    {
      name: "reason",
      description: "reason to kick",
      type: "STRING",
      required: false
    }
  ],
  run: async ({ interaction }) => {
    var _a;
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const member = (_a = interaction.guild) == null ? void 0 : _a.members.cache.get(user == null ? void 0 : user.id);
    if (!member)
      return;
    if (member.user.bot) {
      await interaction.followUp("We don't do that here");
      return;
    }
    if (member.permissions.has(import_discord.Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.followUp("You can't kick administrators");
      return;
    }
    const votekickEmbed = new import_discord.MessageEmbed({
      title: `You are kicking ${member.displayName}`,
      color: "RED",
      description: "Three minutes to vote, vote advantage of three is needed!"
    }).setTimestamp().setThumbnail(user == null ? void 0 : user.displayAvatarURL()).addFields({ name: "Reason", value: reason ? reason : "No reason" }).setAuthor({
      name: interaction.member.displayName,
      iconURL: interaction.member.displayAvatarURL()
    });
    await interaction.followUp({ embeds: [votekickEmbed], fetchReply: true });
    const voteEmbed = await interaction.fetchReply();
    if (!voteEmbed)
      return;
    voteEmbed.react("\u2705");
    voteEmbed.react("\u274C");
    setTimeout(() => {
      var _a2, _b;
      let votesYes = ((_a2 = voteEmbed.reactions.cache.get("\u2705")) == null ? void 0 : _a2.count) ?? 0;
      let votesNo = ((_b = voteEmbed.reactions.cache.get("\u274C")) == null ? void 0 : _b.count) ?? 0;
      if (votesYes > votesNo && votesYes - votesNo >= 3) {
        member.kick();
        const afterkicking = new import_discord.MessageEmbed().setColor("RED").setTitle("We kicked " + member.displayName).setThumbnail(member.displayAvatarURL()).addFields({
          name: "Reason",
          value: reason ? reason : "No reason"
        }).setDescription("Nobody will miss them").addFields(
          { name: "Votes in favour: ", value: (votesYes - 1).toString() },
          { name: "Votes against: ", value: (votesNo - 1).toString() }
        ).setTimestamp();
        interaction.followUp({ embeds: [afterkicking] });
      } else {
        const notKicked = new import_discord.MessageEmbed().setColor("GREEN").setTitle("You are safe " + member.displayName).setThumbnail(member.displayAvatarURL()).setDescription("For now...").addFields(
          { name: "Votes in favour: ", value: (votesYes - 1).toString() },
          { name: "Votes against: ", value: (votesNo - 1).toString() }
        ).setTimestamp();
        interaction.followUp({ embeds: [notKicked] });
      }
    }, 18e4);
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=votekick.js.map
