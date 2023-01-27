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
var interaction_exports = {};
__export(interaction_exports, {
  default: () => interaction_default
});
module.exports = __toCommonJS(interaction_exports);
var import__ = require("../..");
var import_Events = require("../Typings/Events");
var interaction_default = new import_Events.Event("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.deferReply();
    const command = import__.client.commands.get(interaction.commandName);
    if (!command)
      return interaction.followUp("You have used a non existent command!");
    const isCommandOnCooldown = import__.client.commandCooldown.some(
      (val) => {
        return JSON.stringify(val) === JSON.stringify({
          userID: interaction.user.id,
          commandUsed: command.name
        });
      }
    );
    if (isCommandOnCooldown) {
      return interaction.followUp(
        `This comand is currently on cooldown. Wait ${Math.floor(
          (command == null ? void 0 : command.cooldown) / (1e3 * 60)
        )} minute(s)`.concat(
          (command == null ? void 0 : command.cooldown) % 6e4 !== 0 ? ` and ${(command == null ? void 0 : command.cooldown) % 6e4} second(s)` : ""
        )
      );
    }
    await command.run({
      args: interaction.options,
      client: import__.client,
      interaction
    });
    if (command.cooldown) {
      import__.client.commandCooldown.push({
        userID: interaction.user.id,
        commandUsed: command.name
      });
      setTimeout(() => {
        import__.client.commandCooldown.splice(0, 1, {
          userID: interaction.user.id,
          commandUsed: command.name
        });
      }, command.cooldown);
    }
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=interaction.js.map
