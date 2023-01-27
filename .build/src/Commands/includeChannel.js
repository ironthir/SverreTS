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
var includeChannel_exports = {};
__export(includeChannel_exports, {
  default: () => includeChannel_default
});
module.exports = __toCommonJS(includeChannel_exports);
var import_enums = require("discord.js/typings/enums");
var import__ = require("../..");
var import_Commands = require("../Commands");
var includeChannel_default = new import_Commands.Command({
  name: "includechannel",
  description: "Allows gaining experience and money on a channel",
  defaultMemberPermissions: "ADMINISTRATOR",
  options: [
    {
      name: "channel",
      description: "channel to include",
      type: "CHANNEL",
      channelTypes: [import_enums.ChannelTypes.GUILD_TEXT]
    }
  ],
  run: async ({ interaction }) => {
    const temp = await interaction.options.getChannel("channel");
    const channel = temp;
    try {
      const row = await import__.prisma.exclude_moneyandexperience.findFirst({
        where: { serverid: channel.guildId, channelid: channel.id }
      });
      await import__.prisma.exclude_moneyandexperience.delete({
        where: {
          id: row == null ? void 0 : row.id
        }
      });
      interaction.followUp(
        `${channel.name} was successfully included for gaining experience and money!`
      );
    } catch (err) {
      interaction.followUp(
        "An unexpected error occured when trying to exclude the channel."
      );
    }
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=includeChannel.js.map
