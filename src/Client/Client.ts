import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from "discord.js";

require('dotenv').config();

import { CommandType } from "../Commands";
import { RegisterCommandOptions } from "../Types/ClientTypes";
import { Event } from "../Types/Events";
import glob from 'glob'
import {promisify} from 'util'
const globPromise = promisify(glob)

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();
    constructor() {
        super({intents: 32767});
    }
    start() {
        this.registerModules()  
        this.login(process.env.botToken) 
       
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default
    }
    async registerCommands(options: RegisterCommandOptions) {
        if(options.guildId){
            this.guilds.cache.get(options.guildId)?.commands.set(options.commands)
        }
        else{
            this.application?.commands.set(options.commands)
        }
    }
    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = []
        const commandFiles = await globPromise(`**/src/Commands/*(*.ts)`)
        commandFiles.forEach(async (filePath: string) => {
            const command: CommandType  = await this.importFile(`${require.main?.path}/${filePath}`)
            if(!command.name) return;
            this.commands.set(command.name, command)
            slashCommands.push(command)
        })
        const eventFiles = await globPromise(`**/src/Events/*(*.ts)`)     
        eventFiles.forEach(async (filePath: string)  => {
            const event: Event<keyof ClientEvents> = await this.importFile(`${require.main?.path}/${filePath}`)
            this.on(event.event, event.run)
        })
        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                
            });
        });
        
    }

    
}