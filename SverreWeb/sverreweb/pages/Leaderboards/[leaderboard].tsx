import { experiences, PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
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
};

type Props = {
  leaderboard: ExperienceRow[];
  serverInfo: Serverinfo;
  userInfo: UserInfo[];
};

type UserInfoForLeaderboard = {
  id: string;
  username: string;
  points: number;
  level: number;
  avatar: string;
};

export const getServerSideProps = async (context: any) => {
  const prisma = new PrismaClient();
  const leaderboard = await prisma.experiences.findMany({
    where: { serverid: context.params.leaderboard },
  });
  const serverInfo = await axios.get(
    `https://discord.com/api/guilds/${context.params.leaderboard}`,
    {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    }
  );
  const userInfo = await axios.get(
    `https://discord.com/api/guilds/${context.params.leaderboard}/members`,
    {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
      params: { limit: "100" },
    }
  );

  const tempArrayOfUserIDs = leaderboard.map((x) => {
    return x.userid;
  });

  return {
    props: {
      leaderboard: leaderboard,
      serverInfo: serverInfo.data,
      userInfo: userInfo.data.filter((x: UserInfo) =>
        tempArrayOfUserIDs.includes(x.user.id)
      ),
    },
  };
};

const Leaderboard = (props: Props) => {
  const router = useRouter();
  const { leaderboard } = router.query;

  const properLeaderboard = useMemo<UserInfoForLeaderboard[]>(() => {
    return props.userInfo
      .map((x: UserInfo) => {
        return {
          id: x.user.id,
          username: `${x.user.username}#${x.user.discriminator} `,
          points:
            props.leaderboard?.find(
              (y: ExperienceRow) => y.userid === x.user.id
            )?.points ?? 1,
          level:
            props.leaderboard?.find(
              (y: ExperienceRow) => y.userid === x.user.id
            )?.level ?? 1,
          avatar: x.user.avatar,
        };
      })
      .sort((x, y) => {
        return x?.points! > y?.points! ? -1 : 1;
      });
  }, [props.leaderboard, props.userInfo]);
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
                  src={`https://cdn.discordapp.com/icons/${leaderboard}/${props.serverInfo.icon}`}
                />

                <p className="fs-1">Leaderboard for {props.serverInfo.name}</p>
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
