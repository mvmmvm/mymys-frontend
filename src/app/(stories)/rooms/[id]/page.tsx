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
  const [limitOverError, setLimitOverError] = useState(false);
  const [overLoadError, setOverLoadError] = useState(false);
  const [subscription, setSubscription] = useState<ActionCable.Channel>();
  const cable = useMemo(() => {
    return ActionCable.createConsumer(`${process.env.NODE_ENV === 'development' ? 'ws' : 'wss'}://${process.env.NEXT_PUBLIC_API_SERVER_HOST?.replace('https://','').replace('http://','')}/cable`);
  }, []);

  useEffect(() => {
    fetchPlayers();    
  }, [createError, limitOverError]);

  useEffect(() => {
    if (id) {
      const sub = cable.subscriptions.create({ channel: "RoomChannel", room_id: id }, {
        received: (data) => {
          if (data.type === 'story_created' || data.type === 'room_created') {
            fetchPlayers();
          } else if (data.type === 'story_create_error') {
            setCreateError(true)
          } else if (data.type === 'limit_over') {
            setLimitOverError(true)
          } else if (data.type === 'over_load') {
            setOverLoadError(true)
          }
        }
      });
      setSubscription(sub);
      
      return () => {
        sub.unsubscribe();
      };
    }
  }, [cable, id]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_SERVER_HOST}/rooms/${id}/players`
      );
      setPlayers(response.data);
    } catch(error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      {overLoadError && (
        <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          現在一時的にAPIへの負荷が高くなっています。少し置いてやり直してください。
        </h2>
      </div>
      )}
      {limitOverError && (
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            APIへのリクエスト制限に達しました。時間(最大1日)を置いてやり直してください。
          </h2>
        </div>
      )}
      {createError && (
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            生成エラーが起きました。再度やり直すか、多発している場合は開発者に連絡してください。<br/>
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
      ) : !createError && !limitOverError && !overLoadError && (
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            物語を準備しています...<br/>
            ストーリー作成の場合最大で5分ほどかかります。
          </h2>
        </div>
      )}
    </>
  );
};

export default RoomShow;