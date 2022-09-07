import { GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, Container, Image, Row, Table } from "react-bootstrap";
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
          "Bot NzE0MTcyMDEwODc5NTE2NzMz.XsqyhA.KMTAtr8k1j--m60gND45tU09v0A",
      },
    }
  );
  const usersInfo = await axios.get(
    `https://discord.com/api/guilds/${params.leaderboard}/members`,
    {
      headers: {
        limit: 100,
        Authorization:
          "Bot NzE0MTcyMDEwODc5NTE2NzMz.XsqyhA.KMTAtr8k1j--m60gND45tU09v0A",
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
