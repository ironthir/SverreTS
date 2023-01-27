"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var message_exports = {};
__export(message_exports, {
  default: () => message_default
});
module.exports = __toCommonJS(message_exports);
var import_Events = require("../Typings/Events");
var import__ = require("../..");
var import_ExperienceSystem = require("../Client/ExperienceSystem");
var import_MoneySystem = __toESM(require("../Client/MoneySystem"));
var message_default = new import_Events.Event("messageCreate", async (receivedMessage) => {
  if (receivedMessage.author.bot)
    return;
  const excludedChannel = await import__.prisma.exclude_moneyandexperience.findFirst({
    where: { channelid: receivedMessage.channelId }
  });
  if (excludedChannel !== null)
    return;
  if (!import__.client.talkedRecentlyExp.some((val) => {
    var _a;
    return JSON.stringify(val) === JSON.stringify({
      guildID: (_a = receivedMessage.guild) == null ? void 0 : _a.id,
      userID: receivedMessage.author.id
    });
  })) {
    const gainExp = new import_ExperienceSystem.ExperienceSystem(receivedMessage);
    gainExp.GainExperience();
  }
  if (!import__.client.talkedRecentlyMoney.includes(receivedMessage.author.id)) {
    const earnMoney = new import_MoneySystem.default(receivedMessage);
    earnMoney.EarnMoney();
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=message.js.map
