import { experiences } from "@prisma/client";
import { Message, TextChannel } from "discord.js";
import { client, prisma } from "../..";

export class ExperienceSystem {
  private message: Message;
  private multiplier: number = 1;
  constructor(receivedMessage: Message) {
    this.message = receivedMessage;
  }
  private SelectMultiplier(length: number): number {
    return length < 10 ? 0.3 : length >= 10 && length < 30 ? 1 : 1.5;
  }

  private expRequired(level: number): number {
    return 16 * level * level + 150 * level + 100;
  }

  public async GainExperience() {
    const row: experiences | null = await prisma.experiences.findFirst({
      where: { serverid: this.message.guildId, userid: this.message.author.id },
    });
    this.multiplier = this.SelectMultiplier(this.message.content.length);
    const pointsToAdd: number = this.GenerateExperience();
    if (row) {
      if (row.points! + pointsToAdd > this.expRequired(row.level!)) {
        await prisma.experiences.update({
          where: { id: row.id },
          data: { points: { increment: pointsToAdd }, level: { increment: 1 } },
        });
        this.message.channel.send(
          `Congratulations <@${
            this.message.author.id
          }>, you just reached level ${row.level! + 1}!`
        );
      } else {
        await prisma.experiences.update({
          where: { id: row.id },
          data: { points: { increment: pointsToAdd } },
        });
      }
    } else {
      await prisma.experiences.create({
        data: {
          serverid: this.message.guildId,
          userid: this.message.author.id,
          points: pointsToAdd,
          level: 0,
        },
      });
    }
    client.talkedRecentlyExp.push({
      guildID: this.message.guildId,
      userID: this.message.author.id,
    });

    setTimeout(() => {
      try {
        client.talkedRecentlyExp.splice(
          client.talkedRecentlyExp.indexOf({
            guildID: this.message.guildId,
            userID: this.message.author.id,
          }),
          1
        );
      } catch (err) {
        console.error(err);
      }
    }, 30000);
  }
  private GenerateExperience(): number {
    let pointsAdded = Math.floor(
      (Math.random() * (10 - 4 + 1) + 4) * this.multiplier
    );
    return pointsAdded;
  }
}
