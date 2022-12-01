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
class MoneySystem {
    constructor(receivedMessage) {
        this.message = receivedMessage;
    }
    EarnMoney() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield __1.prisma.money.findFirst({
                where: { userID: this.message.author.id },
            });
            if (row) {
                yield __1.prisma.money.update({
                    where: { id: row.id },
                    data: { balance: { increment: 5 } },
                });
            }
            else {
                yield __1.prisma.money.create({
                    data: { balance: 5, userID: this.message.author.id },
                });
            }
            __1.client.talkedRecentlyMoney.push(this.message.author.id);
            setTimeout(() => {
                try {
                    __1.client.talkedRecentlyMoney.splice(__1.client.talkedRecentlyMoney.indexOf(this.message.author.id), 1);
                }
                catch (err) {
                    console.error(err);
                }
            }, 30000);
        });
    }
}
exports.default = MoneySystem;
