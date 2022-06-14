import { ExtendedClient } from "./src/Client/Client";

require("dotenv").config();

export const client = new ExtendedClient();

client.start();