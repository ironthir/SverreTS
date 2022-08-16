import { GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, Container, ListGroup, Row, Table } from "react-bootstrap";
import { Serverinfo, UserInfo } from "../../CommonTypes/CommonTypes";
import "./LeaderboardStyle.module.scss";

const axios = require("axios");
//Ah, this, it allows me to make an api call with self signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
  const ids = await axios.get("https://localhost:7007/GetServerIDs");
  return ids.data.map((x: any) => {
    return { paths: { leaderboard: x } };
  });
}

export async function getStaticPaths() {
  const ids = await axios.get("https://localhost:7007/GetServerIDs");
  const paths = ids.data.map((x: string) => ({
    params: { leaderboard: x },
  }));
  return { paths, fallback: false };
}

export async function getServerData(id: any) {
  const res = await axios.get("https://localhost:7007/GetServerLeaderboard", {
    params: { serverID: id },
  });
  return { id, ...res };
}

export async function getStaticProps({ params }: any) {
  const data = await getServerData(params.leaderboard);
  let arrayOfUserIDs: string[] = data.data.map((x: any) => {
    return x.userid;
  });

  const serverInfo = await axios.get(
    `https://discord.com/api/guilds/${params.leaderboard}`,
    {
      headers: {
        Authorization:
          "Bot There should be a bot token here, but I won't give it to you on a silver plate",
      },
    }
  );
  const usersInfo = await axios.get(
    `https://discord.com/api/guilds/${params.leaderboard}/members`,
    {
      headers: {
        limit: 100,
        Authorization:
          "Bot There should be a bot token here, but I won't give it to you on a silver plate",
      },
      params: { limit: "100" },
    }
  );

  return {
    props: {
      leaderboard: data.data,
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
    <Container className="leaderboard">
      <Card>
        <Card.Header>Leaderboard for {leaderboard.serverInfo.name}</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
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
                  <tr>
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
