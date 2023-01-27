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
exports.ExperienceSystem = void 0;
const __1 = require("../..");
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
  GainExperience() {
    return __awaiter(this, void 0, void 0, function* () {
      const row = yield __1.prisma.experiences.findFirst({
        where: { serverid: this.message.guildId, userid: this.message.author.id }
      });
      this.multiplier = this.SelectMultiplier(this.message.content.length);
      const pointsToAdd = this.GenerateExperience();
      if (row) {
        if (row.points + pointsToAdd > this.expRequired(row.level)) {
          yield __1.prisma.experiences.update({
            where: { id: row.id },
            data: { points: { increment: pointsToAdd }, level: { increment: 1 } }
          });
          this.message.channel.send(`Congratulations <@${this.message.author.id}>, you just reached level ${row.level + 1}!`);
        } else {
          yield __1.prisma.experiences.update({
            where: { id: row.id },
            data: { points: { increment: pointsToAdd } }
          });
        }
      } else {
        yield __1.prisma.experiences.create({
          data: {
            serverid: this.message.guildId,
            userid: this.message.author.id,
            points: pointsToAdd,
            level: 0
          }
        });
      }
      __1.client.talkedRecentlyExp.push({
        guildID: this.message.guildId,
        userID: this.message.author.id
      });
      setTimeout(() => {
        try {
          __1.client.talkedRecentlyExp.splice(__1.client.talkedRecentlyExp.indexOf({
            guildID: this.message.guildId,
            userID: this.message.author.id
          }), 1);
        } catch (err) {
          console.error(err);
        }
      }, 3e4);
    });
  }
  GenerateExperience() {
    let pointsAdded = Math.floor((Math.random() * (10 - 4 + 1) + 4) * this.multiplier);
    return pointsAdded;
  }
}
exports.ExperienceSystem = ExperienceSystem;
//# sourceMappingURL=ExperienceSystem.js.map
