"use client";

import { useState } from "react";
import { Box, Container } from "@mui/material";
import DarkButton from "../../../../dark_button";
import axios from "axios";
import { useEffect } from "react";
import Link from "next/link"
import { parseFormData } from "parse-nested-form-data";

type Player = {
  id: bigint
  name: string;
};

const RoomShow = ({ params }: { params: { id: string } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccured, setError] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(true);
  const id = params.id;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/rooms/${id}/players`)
      .then((res) => res.json())
      .then((players) => setPlayers(players));
  }, []);

  const getPlayers = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    const formData = new FormData(event.currentTarget);
    const formPlayers = parseFormData(formData);
    if(validate(formPlayers)) {
      setIsLoading(true);
      setShowForm(false);
      try {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories/${id}`, { players: formPlayers });
        const players = response.data; 
        updateHtmlWithData(players);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const updateHtmlWithData = (players: any) => {
    setPlayers(players)
  };

  function hasDuplicates<T>(array: T[]): boolean {
    return new Set(array).size !== array.length;
  }

  const validate = (players: any) => {
    let names = [];
    const victim = players.victim
    names.push(victim)
    players.player.forEach((player: any) => {
      if (player.name) {
        names.push(player.name);
      }
    });
    for (let name of names) {
      if ( name.length === 0 ) {
        setErrorMessage("全ての名前を入力してください。");
        return false;
      }
      if ( hasDuplicates(names) ) {
        setErrorMessage("重複する名前があります。");
        return false;
      }
      setErrorMessage(null);
      return true;
    }
  }  

  return (
    <>
      {isLoading && !errorOccured && (
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            物語を作成しています...
          </h2>
        </div>
      )}
      
      {errorOccured && (
        <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          生成エラーが起きました。もう一度やり直してください。
        </h2>
      </div>
      )}
      {players && players.length > 0 ? (
        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          flexWrap="wrap"
        >
        <Container>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            このページを一緒に遊ぶ方にシェアした後、ご自分の名前を選んでください。
          </h2>
        </Container>

          {players.map((player) => (
            <Link href={`/players/${player.id}`} key={player.id} className="space-y-12 m-5">
              <DarkButton size="large" style={{ width: "200px" }}>
                {player.name}
              </DarkButton>
            </Link>
          ))}
        </Box>
      ) : (
        <Container>
          {showForm && (
            <>
        
            {errorMessage && (
              <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
            )}      
            <form id="form" onSubmit={getPlayers} >
          <div className="space-y-12">
            <div className="pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">遊ぶ方のお名前と性別を入力してください。</h2>
              
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    お名前
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="player[0].name"
                      id="player[0].name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                    性別
                  </label>
                  <div className="mt-2">
                    <select
                      id="player[0].gender"
                      name="player[0].gender"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>男性</option>
                      <option>女性</option>
                    </select>
                  </div>
                </div>
              </div>


              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    お名前
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="player[1].name"
                      id="player[1].name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                    性別
                  </label>
                  <div className="mt-2">
                    <select
                      id="player[1].gender"
                      name="player[1].gender"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>男性</option>
                      <option>女性</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    お名前
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="player[2].name"
                      id="player[2].name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                    性別
                  </label>
                  <div className="mt-2">
                    <select
                      id="player[2].gender"
                      name="player[2].gender"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>男性</option>
                      <option>女性</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    被害者の名前
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="victim"
                      id="victim"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                    被害者の性別
                  </label>
                  <div className="mt-2">
                    <select
                      id="v_gender"
                      name="v_gender"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>男性</option>
                      <option>女性</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

          </div>
          <div className="my-6 flex items-center justify-end gap-x-6">
            <DarkButton
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                    作成する
                  </DarkButton>
                </div>
            </form>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default RoomShow;