import { ApplicationCommandDataResolvable } from "discord.js";

export interface RegisterCommandOptions {
  guildId?: string;
  commands: ApplicationCommandDataResolvable[];
}

export type CommandsCooldown = {
  userID: string | null;
  commandUsed: string | null;
};

export type ExpCooldown = {
  guildID: string | null;
  userID: string | null;
};
