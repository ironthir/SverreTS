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
const Events_1 = require("../Typings/Events");
exports.default = new Events_1.Event("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
  if (interaction.isCommand()) {
    yield interaction.deferReply();
    const command = __1.client.commands.get(interaction.commandName);
    if (!command)
      return interaction.followUp("You have used a non existent command!");
    const isCommandOnCooldown = __1.client.commandCooldown.some((val) => {
      return JSON.stringify(val) === JSON.stringify({
        userID: interaction.user.id,
        commandUsed: command.name
      });
    });
    if (isCommandOnCooldown) {
      return interaction.followUp(`This comand is currently on cooldown. Wait ${Math.floor((command === null || command === void 0 ? void 0 : command.cooldown) / (1e3 * 60))} minute(s)`.concat((command === null || command === void 0 ? void 0 : command.cooldown) % 6e4 !== 0 ? ` and ${(command === null || command === void 0 ? void 0 : command.cooldown) % 6e4} second(s)` : ""));
    }
    yield command.run({
      args: interaction.options,
      client: __1.client,
      interaction
    });
    if (command.cooldown) {
      __1.client.commandCooldown.push({
        userID: interaction.user.id,
        commandUsed: command.name
      });
      setTimeout(() => {
        __1.client.commandCooldown.splice(0, 1, {
          userID: interaction.user.id,
          commandUsed: command.name
        });
      }, command.cooldown);
    }
  }
}));
//# sourceMappingURL=interaction.js.map
