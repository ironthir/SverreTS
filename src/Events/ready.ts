import { experiences } from "@prisma/client";
import { client, prisma } from "../..";
import { Event } from "../Typings/Events";

export default new Event("ready", async () => {
  console.log(`Connected as ${client.user?.tag}`);
  const guildsFromApi = client.guilds.cache.map((x) => x.id);
  const guildsFromDB = await prisma.experiences.findMany({
    select: { serverid: true },
  });
  let uniqueGuildsFromDB = guildsFromDB.reduce((arr, obj) => {
    if (!arr.includes(obj.serverid!)) {
      arr.push(obj.serverid!);
    }
    return arr;
  }, [] as string[]);

  for (let guild in uniqueGuildsFromDB) {
    if (!guildsFromApi.includes(guild)) {
      await prisma.experiences.updateMany({
        where: { serverid: guild },
        data: { botpresent: false },
      });
    } else {
      await prisma.experiences.updateMany({
        where: { serverid: guild },
        data: { botpresent: true },
      });
    }
  }
});
