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
var leaderboard_exports = {};
__export(leaderboard_exports, {
  default: () => leaderboard_default
});
module.exports = __toCommonJS(leaderboard_exports);
var import_discord = require("discord.js");
var import_Commands = require("../Commands");
var leaderboard_default = new import_Commands.Command({
  name: "leaderboard",
  description: "Replies with a link to server's leaderboard",
  run: async ({ interaction }) => {
    var _a, _b, _c, _d;
    const leaderboardEmbed = new import_discord.MessageEmbed({
      title: `Leaderboard for ${(_a = interaction.guild) == null ? void 0 : _a.name}`,
      color: "RED",
      url: `https://sverre-ts-ironthir.vercel.app/Leaderboards/${(_b = interaction.guild) == null ? void 0 : _b.id}`
    }).setTimestamp().setThumbnail(
      `https://cdn.discordapp.com/icons/${(_c = interaction.guild) == null ? void 0 : _c.id}/${(_d = interaction.guild) == null ? void 0 : _d.icon}`
    ).setAuthor({
      name: interaction.member.displayName,
      iconURL: interaction.member.displayAvatarURL()
    });
    await interaction.followUp({ embeds: [leaderboardEmbed] });
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=leaderboard.js.map
