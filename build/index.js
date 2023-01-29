"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.client = void 0;
const client_1 = require("@prisma/client");
const Client_1 = require("./src/Client/Client");
exports.client = new Client_1.ExtendedClient();
exports.prisma = new client_1.PrismaClient();
exports.client.start();
exports.client.login(process.env.TOKEN);
