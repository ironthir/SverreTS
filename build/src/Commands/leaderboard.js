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
const discord_js_1 = require("discord.js");
const Commands_1 = require("../Commands");
exports.default = new Commands_1.Command({
    name: "leaderboard",
    description: "Replies with a link to server's leaderboard",
    run: ({ interaction }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const leaderboardEmbed = new discord_js_1.MessageEmbed({
            title: `Leaderboard for ${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.name}`,
            color: "RED",
            url: `https://sverre-ts-ironthir.vercel.app/Leaderboards/${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id}`,
        })
            .setTimestamp()
            .setThumbnail(`https://cdn.discordapp.com/icons/${(_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id}/${(_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.icon}`)
            .setAuthor({
            name: interaction.member.displayName,
            iconURL: interaction.member.displayAvatarURL(),
        });
        yield interaction.followUp({ embeds: [leaderboardEmbed] });
    }),
});
