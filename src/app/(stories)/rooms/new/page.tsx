"use client";

import { Container } from "@mui/material";
import DarkButton from "../../../../dark_button";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { parseFormData } from "parse-nested-form-data";
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useDispatch } from 'react-redux';

type Character = {
  id: bigint;
  name: string;
  gender: string;
}

type Story = {
  id: bigint;
  victim: string;
  v_gender: string;
}

const RoomNew = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const story_id = searchParams?.get("story");
  const [characters, setCharacters] = useState<Character[]>([
    { id: BigInt(1), name: "", gender: "" },
    { id: BigInt(2), name: "", gender: "" },
    { id: BigInt(3), name: "", gender: "" },
  ]);
  const [story, setStory] = useState<Story | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchCharacters = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories/${story_id}/characters`);
      setCharacters(response.data.characters);
      setStory(response.data.story);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log(story_id);
    if (story_id) {
      fetchCharacters();
    }
  }, []);

  function hasDuplicates<T>(array: T[]): boolean {
    return new Set(array).size !== array.length;
  }

  const validate = (players: any) => {
    let names = [];
    const victim = players.victim;
    names.push(victim);
    players.player.forEach((player: any) => {
      if (player.name) {
        names.push(player.name);
      }
    });
    for (let name of names) {
      if (name.length === 0) {
        setErrorMessage("全ての名前を入力してください。");
        return false;
      }
      if (hasDuplicates(names)) {
        setErrorMessage("重複する名前があります。");
        return false;
      }
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formPlayers = parseFormData(formData);
    if (validate(formPlayers)) {
      if (characters[0].name !== "" && story !== null) {
        //ルーム登録時（元となるストーリーがある）
        try {
          const responseRoomCreate = await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories/${story_id}/rooms`);
          const roomSub = responseRoomCreate.data;
          router.push(`/rooms/${roomSub.id}`);
          await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/rooms/${roomSub.id}/players`, { players: formPlayers });
        } catch (error) {
          console.error(error);
        }
      } else {
        //ストーリー・ルーム登録時（元となるストーリーがない）
        try {
          const responseCreateStory = await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories`);
          const roomInit = responseCreateStory.data.room;
          const story = responseCreateStory.data.story;
          router.push(`/rooms/${roomInit.id}`);
          axios.patch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories/${story.id}`, { players: formPlayers, room_id: roomInit.id });
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
          }
        }
      }
    }
  };

  return (
    <>
      <Container>
        {errorMessage && (
          <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
        )}
        <form id="form" onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="pb-12">
              {characters[0].name !== "" && story !== null ? (
                <>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">プレイヤーのお名前を入力してください。</h2>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">（被害者はプレイヤーではありません）</h2>
                </>
              ) : (
                <>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">プレイヤーのお名前と性別を入力してください。</h2>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">（被害者はプレイヤーではありません）</h2>
                </>
              )}
              {characters.map((character, index) => (
                <div key={character.id.toString()} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      お名前
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name={`player[${index}].name`}
                        id={`player[${index}].name`}
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
                        name={`player[${index}].gender`}
                        id={`player[${index}].gender`}
                        defaultValue={character.gender || ""}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
                          story && character.gender ? "my-form-control-disabled" : ""
                        }`}
                      >
                        <option>男性</option>
                        <option>女性</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
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
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${
                        story?.v_gender ? "my-form-control-disabled" : ""
                      }`}
                      defaultValue={story?.v_gender || ""}
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
      </Container>
    </>
  );
};

const RoomNewPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomNew />
    </Suspense>
  );
};

export default RoomNewPage;