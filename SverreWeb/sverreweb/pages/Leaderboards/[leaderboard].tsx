import { PrismaClient } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Container,
  Image,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Serverinfo, UserInfo } from "../../CommonTypes/CommonTypes";
import style from "./LeaderboardStyle.module.scss";

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
  const paths = ids.map((x: any) => ({
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
  avatar?: string;
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
          avatar: x.user.avatar,
        };
      })
      .sort((x, y) => {
        return x?.points! > y?.points! ? -1 : 1;
      });
  }, [leaderboard.leaderboard, leaderboard.usersInfo]);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const renderTooltip = (props: any) => (
    <Tooltip className="d-block d-sm-none" id="button-tooltip " {...props}>
      {tooltip}
    </Tooltip>
  );

  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    domLoaded && (
      <Container>
        <Card bg="dark">
          <Card.Header>
            <Row className="text-center text-white">
              <td>
                <Image
                  roundedCircle={true}
                  fluid={true}
                  sizes={"10px"}
                  src={`https://cdn.discordapp.com/icons/${leaderboard.serverInfo.id}/${leaderboard.serverInfo.icon}`}
                />

                <p className="fs-1">
                  Leaderboard for {leaderboard.serverInfo.name}
                </p>
              </td>
            </Row>
          </Card.Header>
          <Card.Body className="text-white">
            <Container className={style.card}>
              {properLeaderboard.map((x, index) => {
                return (
                  <Row className={style.row} key={index}>
                    <Col xs={1} className={style.positionColumn}>
                      #{index + 1}
                    </Col>
                    <Col
                      xs={1}
                      className={"d-none d-sm-block " + style.avatarClass}
                    >
                      <Image
                        className={style.avatarClass}
                        roundedCircle={true}
                        src={
                          x.avatar
                            ? `https://cdn.discordapp.com/avatars/${x.id}/${x.avatar}.jpg`
                            : "https://cdn.discordapp.com/embed/avatars/1.png"
                        }
                      />
                    </Col>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip}
                      onToggle={() => setTooltip(x.username ?? "")}
                    >
                      <Col xs={7} sm={6} className={style.usernameColumn}>
                        {x.username}
                      </Col>
                    </OverlayTrigger>
                    <Col className={style.pointsColumn} xs={3} sm={3}>
                      {x.points}
                    </Col>
                  </Row>
                );
              })}
            </Container>
          </Card.Body>
        </Card>
      </Container>
    )
  );
};
export default Leaderboard;
