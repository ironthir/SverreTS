"use strict";
var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const Commands_1 = require("../Commands");
exports.default = new Commands_1.Command({
  name: "includechannel",
  description: "Allows gaining experience and money on a channel",
  defaultMemberPermissions: "ADMINISTRATOR",
  options: [
    {
      name: "channel",
      description: "channel to include",
      type: "CHANNEL",
      channelTypes: [0]
    }
  ],
  run: ({ interaction }) => __awaiter(void 0, void 0, void 0, function* () {
    const temp = yield interaction.options.getChannel("channel");
    const channel = temp;
    try {
      const row = yield __1.prisma.exclude_moneyandexperience.findFirst({
        where: { serverid: channel.guildId, channelid: channel.id }
      });
      yield __1.prisma.exclude_moneyandexperience.delete({
        where: {
          id: row === null || row === void 0 ? void 0 : row.id
        }
      });
      interaction.followUp(`${channel.name} was successfully included for gaining experience and money!`);
    } catch (err) {
      interaction.followUp("An unexpected error occured when trying to exclude the channel.");
    }
  })
});
//# sourceMappingURL=includeChannel.js.map
