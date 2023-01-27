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
var MoneySystem_exports = {};
__export(MoneySystem_exports, {
  default: () => MoneySystem_default
});
module.exports = __toCommonJS(MoneySystem_exports);
var import__ = require("../..");
class MoneySystem {
  constructor(receivedMessage) {
    this.message = receivedMessage;
  }
  async EarnMoney() {
    const row = await import__.prisma.money.findFirst({
      where: { userID: this.message.author.id }
    });
    if (row) {
      await import__.prisma.money.update({
        where: { id: row.id },
        data: { balance: { increment: 5 } }
      });
    } else {
      await import__.prisma.money.create({
        data: { balance: 5, userID: this.message.author.id }
      });
    }
    import__.client.talkedRecentlyMoney.push(this.message.author.id);
    setTimeout(() => {
      try {
        import__.client.talkedRecentlyMoney.splice(
          import__.client.talkedRecentlyMoney.indexOf(this.message.author.id),
          1
        );
      } catch (err) {
        console.error(err);
      }
    }, 3e4);
  }
}
var MoneySystem_default = MoneySystem;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=MoneySystem.js.map
