import { PrismaClient } from "@prisma/client";
import { ExtendedClient } from "./src/Client/Client";

export const client = new ExtendedClient();

export const prisma = new PrismaClient();

client.start();
client.login(process.env.TOKEN);
