import { Command } from "../Commands";

export default new Command({
    name: "ping",
    description: "replies with pong",
    run: async({interaction}) => {
        interaction.followUp("Pong")
    
    }
})