import { Event } from "../Types/Events";

export default new Event("ready", () => {
    console.log("Bot is online");
});