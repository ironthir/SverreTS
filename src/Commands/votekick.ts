import { userMention } from "@discordjs/builders";
import { Command } from "../Commands";

export default new Command({
    name: "votekick",
    description: "Launches a vote to kick a member of the server",
    options: [
        {
            name: "user",
            description: "member to kick",
            type: 'USER',
            required: true
        },
        {
            name: "reason",
            description: "why you wanna kick em",
            type: 'STRING',
            required: false
        },

],
    run: async({interaction}) => {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason')
        const member = interaction.guild?.members.cache.get(user?.id!)
        if(!member?.kickable){
           return  interaction.followUp("This user cannot be kicked by a Discord bot");
        }
        
    }
})