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
var ExperienceSystem_exports = {};
__export(ExperienceSystem_exports, {
  ExperienceSystem: () => ExperienceSystem
});
module.exports = __toCommonJS(ExperienceSystem_exports);
var import__ = require("../..");
class ExperienceSystem {
  constructor(receivedMessage) {
    this.multiplier = 1;
    this.message = receivedMessage;
  }
  SelectMultiplier(length) {
    return length < 10 ? 0.3 : length >= 10 && length < 30 ? 1 : 1.5;
  }
  expRequired(level) {
    return 16 * level * level + 150 * level + 100;
  }
  async GainExperience() {
    const row = await import__.prisma.experiences.findFirst({
      where: { serverid: this.message.guildId, userid: this.message.author.id }
    });
    this.multiplier = this.SelectMultiplier(this.message.content.length);
    const pointsToAdd = this.GenerateExperience();
    if (row) {
      if (row.points + pointsToAdd > this.expRequired(row.level)) {
        await import__.prisma.experiences.update({
          where: { id: row.id },
          data: { points: { increment: pointsToAdd }, level: { increment: 1 } }
        });
        this.message.channel.send(
          `Congratulations <@${this.message.author.id}>, you just reached level ${row.level + 1}!`
        );
      } else {
        await import__.prisma.experiences.update({
          where: { id: row.id },
          data: { points: { increment: pointsToAdd } }
        });
      }
    } else {
      await import__.prisma.experiences.create({
        data: {
          serverid: this.message.guildId,
          userid: this.message.author.id,
          points: pointsToAdd,
          level: 0
        }
      });
    }
    import__.client.talkedRecentlyExp.push({
      guildID: this.message.guildId,
      userID: this.message.author.id
    });
    setTimeout(() => {
      try {
        import__.client.talkedRecentlyExp.splice(
          import__.client.talkedRecentlyExp.indexOf({
            guildID: this.message.guildId,
            userID: this.message.author.id
          }),
          1
        );
      } catch (err) {
        console.error(err);
      }
    }, 3e4);
  }
  GenerateExperience() {
    let pointsAdded = Math.floor(
      (Math.random() * (10 - 4 + 1) + 4) * this.multiplier
    );
    return pointsAdded;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExperienceSystem
});
//# sourceMappingURL=ExperienceSystem.js.map
