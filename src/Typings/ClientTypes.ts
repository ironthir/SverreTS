import { ApplicationCommandDataResolvable } from "discord.js";

export interface RegisterCommandOptions {
  guildId?: string;
  commands: ApplicationCommandDataResolvable[];
}
export type CommandsCooldown = {
  guildID: string | null;
  commandUsed: string | null;
};
export type ExpCooldown = {
  guildID: string | null;
  userID: string | null;
};
