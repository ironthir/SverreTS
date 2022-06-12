import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionResolvable, UserMention } from "discord.js";
import { ExtendedClient } from "./Client/Client";

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember
}
interface RunOptions {
    client: ExtendedClient,
    interaction: ExtendedInteraction,
    args: CommandInteractionOptionResolver
}

type RunFunction = (option: RunOptions) => void;
export type CommandType = {
    run: RunFunction
    userPermissions?: PermissionResolvable[];
    cooldown?: number;
} & ChatInputApplicationCommandData

export class Command {
    constructor(commandOptions: CommandType) {
        Object.assign(this, commandOptions)
    }
}