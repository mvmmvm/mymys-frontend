"use client";

import { Container } from "@mui/material";
import DarkButton from "../../../../dark_button";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { parseFormData } from "parse-nested-form-data";
import { useRouter } from 'next/navigation';

type Character = {
  id: bigint
  name: string;
  gender: string;
}

type Story = {
  id: bigint
  victim: string
  v_gender: string
}

const RoomNew = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const story_id = searchParams.get("story");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [story, setStory] = useState<Story | null>(null);
  const [name, setName] = useState('');
  const [victim, setVictim] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories/${story_id}/characters`);
      setCharacters(response.data.characters);
      setStory(response.data.story);
    } catch (err) {
      setNotFound(true)
      let list_element = document.getElementById("loading");
      if (list_element) {
        list_element.remove();
      }
    }
  };

  useEffect(() => {
    fetchCharacters();    
  }, []);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formPlayers = parseFormData(formData);
    if (validate(formPlayers)) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories/${story_id}/rooms`);
        const room = response.data;
        await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/rooms/${room.id}/players`, {players: formPlayers});
        router.push(`/rooms/${room.id}`)
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

  return (
    <>
    {characters && story && characters.length > 0 ? (
      <Container>
        {errorMessage && (
          <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
        )}
        <form id="form" onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">遊ぶ方のお名前を入力してください。</h2>
            {characters.map((character,index) => (
            
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                  お名前
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name={`player[${index}].name`}
                    id={`player[${index}].name`}
                    onChange={(e) => setName(e.target.value)}
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
                    value={character.gender}
                    className="block my-form-control-disabled w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    
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
                   
                    onChange={(e) => setVictim(e.target.value)}
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
                    className="my-form-control-disabled block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            
                    value={story.v_gender}
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
     ) : (
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900" id="loading">
          ストーリーを取得中です...
        </h2>
      </div>
     )}
     {notFound && (
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        ストーリーが見つかりませんでした。
      </h2>
     )}
    </>
  );
};

export default RoomNew;