import { Message } from "discord.js";
import { client } from "../..";

const CalculateExp = (receivedMessage: Message) => {
  if (client.talkedRecentlyExp.has(receivedMessage.author.id)) return;
  if (receivedMessage.content.includes("http")) return;
};
export default CalculateExp;
