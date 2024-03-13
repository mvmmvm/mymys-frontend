"use client";

import { useState } from "react";  // 新しく追加
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  Modal,
  Container
} from "@mui/material";
import DarkButton from "../../../../dark_button";
import axios from "axios";
import { Suspense, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"
import { ClassNames } from "@emotion/react";
import { Margin } from "@mui/icons-material";


type Player = {
  id: bigint
  name: string;
};

const RoomShow = ({ params }: { params: { id: string } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const id = params.id;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/rooms/${id}/players`)
      .then((res) => res.json())
      .then((players) => setPlayers(players));
  }, []);

  const getPlayers = async () => {
    setIsLoading(true)
    removeOldHtmlAndShowLoading();
    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories/${id}`);
      const players = response.data; 
      updateHtmlWithData(players);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeOldHtmlAndShowLoading = () => {
    let list_element = document.getElementById("form");
    if (list_element) {
      list_element.remove();
    }
  };

  // 新しいデータを使ってHTMLを更新する関数
  const updateHtmlWithData = (players: any) => {
    console.log(players)
    setPlayers(players)
  };

  return (
    <>
      {isLoading && (
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            物語を作成しています...
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
      <form id="form">
      <div className="space-y-12">
        <div className="pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">遊ぶ方のお名前を入力してください。</h2>
          
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                お名前
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name1"
                  id="name1"
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
                  id="gender1"
                  name="gender1"
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
                  name="name1"
                  id="name1"
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
                  id="gender1"
                  name="gender1"
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
                  name="name1"
                  id="name1"
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
                  id="gender1"
                  name="gender1"
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
          onClick={() => getPlayers()}
        >
                作成する
              </DarkButton>
            </div>
          </form>
        </Container>
      )}
    </>
  );
};

export default RoomShow;