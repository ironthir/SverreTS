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
var Client_exports = {};
__export(Client_exports, {
  ExtendedClient: () => ExtendedClient
});
module.exports = __toCommonJS(Client_exports);
var import_discord = require("discord.js");
var import_glob = __toESM(require("glob"));
var import_util = require("util");
require("dotenv").config();
const globPromise = (0, import_util.promisify)(import_glob.default);
class ExtendedClient extends import_discord.Client {
  constructor() {
    super({ intents: 32767 });
    this.commands = new import_discord.Collection();
    this.talkedRecentlyExp = [];
    this.talkedRecentlyMoney = [];
    this.commandCooldown = [];
  }
  start() {
    this.registerModules();
    this.login(process.env.TOKEN);
  }
  async importFile(filePath) {
    var _a;
    return (_a = await import(filePath)) == null ? void 0 : _a.default;
  }
  async registerCommands(options) {
    var _a, _b;
    if (options.guildId) {
      (_a = this.guilds.cache.get(options.guildId)) == null ? void 0 : _a.commands.set(options.commands);
      console.log(`Registering commands to ${options.guildId}`);
    } else {
      (_b = this.application) == null ? void 0 : _b.commands.set(options.commands);
      console.log("Registering global commands");
    }
  }
  async registerModules() {
    const slashCommands = [];
    const commandFiles = await globPromise(`**/src/Commands/*(*.ts)`);
    commandFiles.forEach(async (filePath) => {
      var _a;
      const command = await this.importFile(
        `${(_a = require.main) == null ? void 0 : _a.path}/${filePath}`
      );
      if (!command.name)
        return;
      this.commands.set(command.name, command);
      slashCommands.push(command);
    });
    const eventFiles = await globPromise(`**/src/Events/*(*.ts)`);
    eventFiles.forEach(async (filePath) => {
      var _a;
      const event = await this.importFile(
        `${(_a = require.main) == null ? void 0 : _a.path}/${filePath}`
      );
      this.on(event.event, event.run);
    });
    this.on("ready", () => {
      this.registerCommands({
        commands: slashCommands
      });
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExtendedClient
});
//# sourceMappingURL=Client.js.map
