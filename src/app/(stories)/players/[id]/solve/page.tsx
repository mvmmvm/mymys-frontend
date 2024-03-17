"use client";

import * as React from 'react';
import ActionCable from 'actioncable';
import { useRouter } from 'next/navigation';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState, useMemo } from "react";
import DarkButton from '@/dark_button';
import { Container } from "@mui/material";
import axios from "axios";

type Player = {
  id: bigint,
  name: string
}

const Solve = ({ params }: { params: { id: string } }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const { id } = params;
  const [roomId, setRoomId] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<ActionCable.Channel>();
  const [answerCount, setAnswerCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const cable = useMemo(() => {
    return ActionCable.createConsumer(`${process.env.NODE_ENV === 'development' ? 'ws' : 'wss'}://${process.env.NEXT_PUBLIC_API_SERVER_HOST?.replace('https://','').replace('http://','')}/cable`);
  }, []);

  const setAnswer = async () => {
    const answer = {room_id: roomId, suspected: selectedPlayer}
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/players/${id}/answer`, answer);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (roomId && id) {
      const sub = cable.subscriptions.create({ channel: "RoomChannel", room_id: roomId }, {
        received: (data) => {
          if (data.type === 'answer') {
            setAnswerCount(data.answer_count);
            if (data.player_id === id) {
              setDisabled(true);
            }
          }
        }
      });
      setSubscription(sub);
      
      return () => {
        sub.unsubscribe();
      };
    }
  }, [cable, roomId, id]);

  const handleSend = () => {
    subscription?.perform('answer', { room_id: roomId, player_id: id});
    setAnswer();
    setDisabled(true);
    removeButtons();
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPlayer(event.target.value);
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/players/${id}/solve`)
      .then((res) => res.json())
      .then(({ names, room_id, answer_count, answered}) => {
        if (names) {
          setPlayers(names);
        } else {
          setPlayers([]);
        }
        setRoomId(room_id);
        setAnswerCount(answer_count)
        setAnswered(answered)
        setDisabled(false)
      });
  }, [roomId, id]);

  useEffect(() => {
    if (answerCount === 3) {
      router.push(`/players/${id}/answer`);
    }
  }, [answerCount, router]);

  const removeButtons = () => {
    let button = document.getElementById("button_answer");
    if (button) {
      button.remove()
    }
  };
  const playerItems = players.map((player) => (
    <MenuItem key={player.id.toString()} value={player.id.toString()}>
      {player.name}
    </MenuItem>
  ));

  const dummyItems = [
    <MenuItem key="dummy1" value="dummy1">ダミー</MenuItem>,
    <MenuItem key="dummy2" value="dummy2">ダミー</MenuItem>
  ];

  const menuItems = players && players.length > 0 ? playerItems : dummyItems;

  return (
    <Container className="flex justify-center items-center m-8">
      
      <div className="w-full max-w-xs mx-auto">
      {players.length === 0 && (<div className="m-4 text-sm text-red-800 rounded">※操作ダミー用セレクトボックスです。</div>)}
        <FormControl fullWidth disabled={disabled}>
          <InputLabel id="demo-simple-select-label" style={{ color: 'red' }}
          >犯人は</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-sqimple-select"
            label="criminal"
            value={selectedPlayer}
            onChange={handleChange}
          >
            {menuItems}
          </Select>
          {players.length > 0 && (
            <p className='text-right text-sm text-red-800 rounded'>お前だ！</p>
          )}
          {!answered && (
          <div className="mt-4 text-center">
            <DarkButton
              onClick={handleSend}
              id='button_answer'
              size="large"
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              回答する！
            </DarkButton>
          </div>
          )}
        </FormControl>
        <div>
          <p>{answerCount}人が回答ボタンを押しました。</p>
          <p>全員が揃ったら結果を表示します。</p>
        </div>
        
      </div>
    </Container>
  );
}
  
export default Solve;