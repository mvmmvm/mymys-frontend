"use client";

import { Container } from "@mui/material";
import DarkButton from "../../../../dark_button";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const RoomNew = () => {
  const searchParams = useSearchParams();
  const story_id = searchParams.get("story");

  const getPlayers = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories/${story_id}/rooms`);
      const room = response.data;
      await axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/rooms/${room.id}/players`);
      window.location.href = `/rooms/${room.id}`;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  return (
    <>
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
    </>
  );
};

export default RoomNew;