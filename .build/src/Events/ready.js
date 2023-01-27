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
var ready_exports = {};
__export(ready_exports, {
  default: () => ready_default
});
module.exports = __toCommonJS(ready_exports);
var import__ = require("../..");
var import_Events = require("../Typings/Events");
var ready_default = new import_Events.Event("ready", async () => {
  var _a;
  console.log(`Connected as ${(_a = import__.client.user) == null ? void 0 : _a.tag}`);
  const guildsFromApi = import__.client.guilds.cache.map((x) => x.id);
  const guildsFromDB = await import__.prisma.experiences.findMany({
    select: { serverid: true }
  });
  let uniqueGuildsFromDB = guildsFromDB.reduce((arr, obj) => {
    if (!arr.includes(obj.serverid)) {
      arr.push(obj.serverid);
    }
    return arr;
  }, []);
  for (let guild in uniqueGuildsFromDB) {
    if (!guildsFromApi.includes(guild)) {
      await import__.prisma.experiences.updateMany({
        where: { serverid: guild },
        data: { botpresent: false }
      });
    } else {
      await import__.prisma.experiences.updateMany({
        where: { serverid: guild },
        data: { botpresent: true }
      });
    }
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=ready.js.map
