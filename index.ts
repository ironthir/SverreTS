import { PrismaClient } from "@prisma/client";
import { ExtendedClient } from "./src/Client/Client";

require("dotenv").config();

export const client = new ExtendedClient();

export const prisma = new PrismaClient();

client.start();
client.login(process.env.TOKEN);
