import { Message, TextChannel } from "discord.js";
import { Event } from "../Typings/Events";
import { client, prisma } from "../..";
import { ExpCooldown } from "../Typings/ClientTypes";
import { ExperienceSystem } from "../Client/ExperienceSystem";
import MoneySystem from "../Client/MoneySystem";

export default new Event("messageCreate", async (receivedMessage: Message) => {
  if (receivedMessage.author.bot) return;

  const excludedChannel = await prisma.exclude_moneyandexperience.findFirst({
    where: { channelid: receivedMessage.channelId },
  });

  if (excludedChannel !== null) return;

  if (
    !client.talkedRecentlyExp.some((val: ExpCooldown) => {
      return (
        JSON.stringify(val) ===
        JSON.stringify({
          guildID: receivedMessage.guild?.id,
          userID: receivedMessage.author.id,
        })
      );
    })
  ) {
    const gainExp = new ExperienceSystem(receivedMessage);
    gainExp.GainExperience();
  }

  if (!client.talkedRecentlyMoney.includes(receivedMessage.author.id)) {
    const earnMoney = new MoneySystem(receivedMessage);
    earnMoney.EarnMoney();
  }
});
