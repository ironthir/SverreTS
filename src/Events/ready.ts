import { client } from "../..";
import { Event } from "../Typings/Events";

export default new Event("ready", async () => {
  console.log(`Connected as ${client.user?.tag}`);
});
