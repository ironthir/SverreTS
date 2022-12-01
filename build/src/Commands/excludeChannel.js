"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const Commands_1 = require("../Commands");
exports.default = new Commands_1.Command({
    name: "excludechannel",
    description: "Prevents users from getting experience and money from writing on a given channel",
    defaultMemberPermissions: "ADMINISTRATOR",
    options: [
        {
            name: "channel",
            description: "channel to exlude",
            type: "CHANNEL",
            channelTypes: [0 /* ChannelTypes.GUILD_TEXT */],
        },
    ],
    run: ({ interaction }) => __awaiter(void 0, void 0, void 0, function* () {
        const temp = yield interaction.options.getChannel("channel");
        const channel = temp;
        try {
            yield __1.prisma.exclude_moneyandexperience.create({
                data: {
                    serverid: channel.guildId,
                    channelid: channel.id,
                },
            });
            interaction.followUp(`${channel.name} was successfully excluded from gaining experience and money!`);
        }
        catch (err) {
            interaction.followUp("An unexpected error occured when trying to exclude the channel.");
        }
    }),
});
