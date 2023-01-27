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
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("../Typings/Events");
const __1 = require("../..");
const ExperienceSystem_1 = require("../Client/ExperienceSystem");
const MoneySystem_1 = __importDefault(require("../Client/MoneySystem"));
exports.default = new Events_1.Event("messageCreate", (receivedMessage) => __awaiter(void 0, void 0, void 0, function* () {
  if (receivedMessage.author.bot)
    return;
  const excludedChannel = yield __1.prisma.exclude_moneyandexperience.findFirst({
    where: { channelid: receivedMessage.channelId }
  });
  if (excludedChannel !== null)
    return;
  if (!__1.client.talkedRecentlyExp.some((val) => {
    var _a;
    return JSON.stringify(val) === JSON.stringify({
      guildID: (_a = receivedMessage.guild) === null || _a === void 0 ? void 0 : _a.id,
      userID: receivedMessage.author.id
    });
  })) {
    const gainExp = new ExperienceSystem_1.ExperienceSystem(receivedMessage);
    gainExp.GainExperience();
  }
  if (!__1.client.talkedRecentlyMoney.includes(receivedMessage.author.id)) {
    const earnMoney = new MoneySystem_1.default(receivedMessage);
    earnMoney.EarnMoney();
  }
}));
//# sourceMappingURL=message.js.map
