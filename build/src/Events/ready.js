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
const Events_1 = require("../Typings/Events");
exports.default = new Events_1.Event("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(`Connected as ${(_a = __1.client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    const guildsFromApi = __1.client.guilds.cache.map((x) => x.id);
    const guildsFromDB = yield __1.prisma.experiences.findMany({
        select: { serverid: true },
    });
    let uniqueGuildsFromDB = guildsFromDB.reduce((arr, obj) => {
        if (!arr.includes(obj.serverid)) {
            arr.push(obj.serverid);
        }
        return arr;
    }, []);
    for (let guild in uniqueGuildsFromDB) {
        if (!guildsFromApi.includes(guild)) {
            yield __1.prisma.experiences.updateMany({
                where: { serverid: guild },
                data: { botpresent: false },
            });
        }
        else {
            yield __1.prisma.experiences.updateMany({
                where: { serverid: guild },
                data: { botpresent: true },
            });
        }
    }
}));
