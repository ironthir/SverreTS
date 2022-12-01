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
    name: "votekick",
    description: "Launches a vote to kick a member of the server",
    cooldown: 300000,
    options: [
        {
            name: "user",
            description: "member to kick",
            type: "USER",
            required: true,
        },
        {
            name: "reason",
            description: "reason to kick",
            type: "STRING",
            required: false,
        },
    ],
    run: ({ interaction }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");
        const member = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(user === null || user === void 0 ? void 0 : user.id);
        if (!member)
            return;
        if (member.user.bot) {
            yield interaction.followUp("We don't do that here");
            return;
        }
        if (member.permissions.has(discord_js_1.Permissions.FLAGS.ADMINISTRATOR)) {
            yield interaction.followUp("You can't kick administrators");
            return;
        }
        const votekickEmbed = new discord_js_1.MessageEmbed({
            title: `You are kicking ${member.displayName}`,
            color: "RED",
            description: "Three minutes to vote, vote advantage of three is needed!",
        })
            .setTimestamp()
            .setThumbnail(user === null || user === void 0 ? void 0 : user.displayAvatarURL())
            .addFields({ name: "Reason", value: reason ? reason : "No reason" })
            .setAuthor({
            name: interaction.member.displayName,
            iconURL: interaction.member.displayAvatarURL(),
        });
        yield interaction.followUp({ embeds: [votekickEmbed], fetchReply: true });
        const voteEmbed = (yield interaction.fetchReply());
        if (!voteEmbed)
            return;
        voteEmbed.react("✅");
        voteEmbed.react("❌");
        setTimeout(() => {
            var _a, _b, _c, _d;
            let votesYes = (_b = (_a = voteEmbed.reactions.cache.get("✅")) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
            let votesNo = (_d = (_c = voteEmbed.reactions.cache.get("❌")) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0;
            if (votesYes > votesNo && votesYes - votesNo >= 3) {
                member.kick();
                const afterkicking = new discord_js_1.MessageEmbed()
                    .setColor("RED")
                    .setTitle("We kicked " + member.displayName)
                    .setThumbnail(member.displayAvatarURL())
                    .addFields({
                    name: "Reason",
                    value: reason ? reason : "No reason",
                })
                    .setDescription("Nobody will miss them")
                    .addFields({ name: "Votes in favour: ", value: (votesYes - 1).toString() }, { name: "Votes against: ", value: (votesNo - 1).toString() })
                    .setTimestamp();
                interaction.followUp({ embeds: [afterkicking] });
            }
            else {
                const notKicked = new discord_js_1.MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("You are safe " + member.displayName)
                    .setThumbnail(member.displayAvatarURL())
                    .setDescription("For now...")
                    .addFields({ name: "Votes in favour: ", value: (votesYes - 1).toString() }, { name: "Votes against: ", value: (votesNo - 1).toString() })
                    .setTimestamp();
                interaction.followUp({ embeds: [notKicked] });
            }
        }, 180000);
    }),
});
