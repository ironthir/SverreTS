import { experiences, PrismaClient } from "@prisma/client";
import { useMemo } from "react";
import { Card, Col, Container, Image, Row, Table } from "react-bootstrap";
import { Serverinfo, UserInfo } from "../../CommonTypes/CommonTypes";

const axios = require("axios");

export type ExperienceRow = {
  id: number;
  serverid: string;
  userid: string;
  points: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function getStaticIDs() {
  const prisma = new PrismaClient();
  const ids = await prisma.experiences.findMany();
  return ids.map((x: any) => {
    return { paths: { leaderboard: x } };
  });
}

export async function getStaticPaths() {
  const prisma = new PrismaClient();
  const ids = await prisma.experiences.findMany();
  const paths = ids.map((x: experiences) => ({
    params: { leaderboard: x.serverid },
  }));
  return { paths, fallback: false };
}

export async function getServerData(id: any) {
  const prisma = new PrismaClient();
  const lead = await prisma.experiences.findMany({ where: { serverid: id } });
  return lead;
}

export async function getStaticProps({ params }: any) {
  const data = await getServerData(params.leaderboard);
  let arrayOfUserIDs: string[] = data.map((x: any) => {
    return x.userid;
  });

  const serverInfo = await axios.get(
    `https://discord.com/api/guilds/${params.leaderboard}`,
    {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    }
  );
  const usersInfo = await axios.get(
    `https://discord.com/api/guilds/${params.leaderboard}/members`,
    {
      headers: {
        limit: 100,
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      params: { limit: "100" },
    }
  );

  return {
    props: {
      leaderboard: data,
      serverInfo: serverInfo.data,
      usersInfo: usersInfo.data.filter((x: UserInfo) => {
        return !x.user.bot && arrayOfUserIDs.includes(x.user.id);
      }),
    },
  };
}

type Props = {
  leaderboard: ExperienceRow[];
  serverInfo: Serverinfo;
  usersInfo: UserInfo[];
};

//These are all optional, because I'm too lazy to type them properly, and it's late
type UserInfoForLeaderboard = {
  id?: string;
  username?: string;
  points?: number;
  level?: number;
};

const Leaderboard = (leaderboard: Props) => {
  const properLeaderboard = useMemo<UserInfoForLeaderboard[]>(() => {
    return leaderboard.usersInfo
      .map((x: UserInfo) => {
        return {
          id: x.user.id,
          username: `${x.user.username}#${x.user.discriminator} `,
          points: leaderboard.leaderboard.find(
            (y: ExperienceRow) => y.userid === x.user.id
          )?.points,
          level: leaderboard.leaderboard.find(
            (y: ExperienceRow) => y.userid === x.user.id
          )?.level,
        };
      })
      .sort((x, y) => {
        return x?.points! > y?.points! ? -1 : 1;
      });
  }, []);

  return (
    <Container className="leaderboard text-white">
      <Card bg="dark">
        <Card.Header>
          <Row className="text-center">
            <Col>
              <Image
                roundedCircle={true}
                fluid={true}
                sizes={"10px"}
                src={`https://cdn.discordapp.com/icons/${leaderboard.serverInfo.id}/${leaderboard.serverInfo.icon}`}
              />

              <p className="fs-1">
                Leaderboard for {leaderboard.serverInfo.name}
              </p>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Table className=" text-white" bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Level</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {properLeaderboard.map((x: UserInfoForLeaderboard, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{x.username}</td> <td>{x.level}</td>
                    <td>{x.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Leaderboard;
