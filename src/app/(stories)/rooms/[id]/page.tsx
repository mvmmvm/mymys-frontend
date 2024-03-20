"use client";

import { useState, useMemo } from "react";
import { Box, Container } from "@mui/material";
import DarkButton from "../../../../dark_button";
import axios from "axios";
import { useEffect } from "react";
import Link from "next/link"
import ActionCable from 'actioncable';

type Player = {
  id: bigint
  name: string;
};

const RoomShow = ({ params }: { params: { id: string } }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const id = params.id;
  const [createError, setCreateError] = useState(false);
  const [subscription, setSubscription] = useState<ActionCable.Channel>();
  const cable = useMemo(() => {
    return ActionCable.createConsumer(`${process.env.NODE_ENV === 'development' ? 'ws' : 'wss'}://${process.env.NEXT_PUBLIC_API_SERVER_HOST?.replace('https://','').replace('http://','')}/cable`);
  }, []);

  useEffect(() => {
    fetchPlayers();    
  }, []);

  useEffect(() => {
    if (id) {
      const sub = cable.subscriptions.create({ channel: "RoomChannel", room_id: id }, {
        received: (data) => {
          if (data.type === 'story_created') {
            fetchPlayers();
          } else if (data.type === 'story_create_error') {
            setCreateError(true)
          }
        }
      });
      setSubscription(sub);
      
      return () => {
        sub.unsubscribe();
      };
    }
  }, []);

  const fetchPlayers = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_SERVER_HOST}/rooms/${id}/players`
    );
    setPlayers(response.data);   
  };

  return (
    <>
      {createError && (
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            生成エラーが起きました。もう一度やり直してください。
          </h2>
        </div>
      )}
      {players && players.length > 0 ? (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box>
            <Container sx={{ textAlign: "center" }}>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                このページを一緒に遊ぶ方にシェアした後、ご自分の名前を選んでください。
              </h2>
            </Container>
          </Box>
          <Box
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            flexWrap="wrap"
          >
          {players.map((player) => (
            <Link href={`/players/${player.id}`} key={player.id} className="mx-5 my-10">
              <DarkButton size="large" style={{ width: "200px" }}>
                {player.name}
              </DarkButton>
            </Link>
          ))}
          </Box>
        </Container>
      ) : !createError && (
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            物語を準備しています...
          </h2>
        </div>
      )}
    </>
  );
};

export default RoomShow;