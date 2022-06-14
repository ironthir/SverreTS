import { Message } from "discord.js";
import { money, PrismaClient } from "@prisma/client";
import { TextChannel } from "discord.js";
import { client } from "../..";
const prisma = new PrismaClient();

class MoneySystem {
  private message: Message;
  constructor(receivedMessage: Message) {
    this.message = receivedMessage;
  }
  public async EarnMoney() {
    const row = await prisma.money.findFirst({
      where: { userID: this.message.author.id },
    });
    if (row) {
      await prisma.money.update({
        where: { id: row.id },
        data: { balance: { increment: 5 } },
      });
    } else {
      await prisma.money.create({
        data: { balance: 5, userID: this.message.author.id },
      });
    }
    client.talkedRecentlyMoney.push(this.message.author.id);
    setTimeout(() => {
      try {
        client.talkedRecentlyMoney.splice(
          client.talkedRecentlyMoney.indexOf(this.message.author.id),
          1
        );
      } catch (err) {
        console.error(err);
      }
    }, 30000);
  }
}
export default MoneySystem;
