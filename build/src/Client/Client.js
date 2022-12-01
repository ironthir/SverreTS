"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require("discord.js");
require("dotenv").config();
const glob_1 = __importDefault(require("glob"));
const util_1 = require("util");
const globPromise = (0, util_1.promisify)(glob_1.default);
class ExtendedClient extends discord_js_1.Client {
    constructor() {
        super({ intents: 32767 });
        this.commands = new discord_js_1.Collection();
        this.talkedRecentlyExp = [];
        this.talkedRecentlyMoney = [];
        this.commandCooldown = [];
    }
    start() {
        this.registerModules();
        this.login(process.env.TOKEN);
    }
    importFile(filePath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield Promise.resolve().then(() => __importStar(require(filePath))))) === null || _a === void 0 ? void 0 : _a.default;
        });
    }
    registerCommands(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (options.guildId) {
                (_a = this.guilds.cache.get(options.guildId)) === null || _a === void 0 ? void 0 : _a.commands.set(options.commands);
                console.log(`Registering commands to ${options.guildId}`);
            }
            else {
                (_b = this.application) === null || _b === void 0 ? void 0 : _b.commands.set(options.commands);
                console.log("Registering global commands");
            }
        });
    }
    registerModules() {
        return __awaiter(this, void 0, void 0, function* () {
            const slashCommands = [];
            const commandFiles = yield globPromise(`**/src/Commands/*(*.ts)`);
            commandFiles.forEach((filePath) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const command = yield this.importFile(`${(_a = require.main) === null || _a === void 0 ? void 0 : _a.path}/${filePath}`);
                if (!command.name)
                    return;
                this.commands.set(command.name, command);
                slashCommands.push(command);
            }));
            const eventFiles = yield globPromise(`**/src/Events/*(*.ts)`);
            eventFiles.forEach((filePath) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const event = yield this.importFile(`${(_b = require.main) === null || _b === void 0 ? void 0 : _b.path}/${filePath}`);
                this.on(event.event, event.run);
            }));
            this.on("ready", () => {
                this.registerCommands({
                    commands: slashCommands,
                });
            });
        });
    }
}
exports.ExtendedClient = ExtendedClient;
