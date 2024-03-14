"use client";

import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Container } from "@mui/material";
import { useEffect, useState } from 'react';
import DarkButton from '@/dark_button';

type Character = {
  id: bigint
  story_id: bigint
  name: string;
  gender: string;
  personality: string;
  job: string;
  introduce: string;
  stuff: string;
  evidence: Array<string>;
  is_criminal: boolean;
};

type Story = {
  id: bigint;
  name: string;
  set: string;
  body: string;
  weapon: string;
  place: string;
  time: string;
  victim: string;
  v_gender: string;
  v_personality: string;
  v_job: string;
  confession: string;
}

const PlayerShow = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [character, setCharacter] = useState<Character | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [stuffs, setStuffs] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/players/${id}`)
      .then((res) => res.json())
      .then(({ character, story, stuffs }) => {
        setStory(story);
        setCharacter(character);
        setStuffs(stuffs);
      });
  }, []);


    return (
      <>
        {story && character && (
          <div>
          {character.is_criminal ? (
            <Accordion defaultExpanded className="bg-red-100 p-4 rounded-lg" >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
              <h2 className="text-base font-semibold leading-7 text-red-900">
                あなたが犯人です。
              </h2>
              </AccordionSummary>
              <AccordionDetails>
              <div className="text-red-800 rounded">
                下の表向きの情報を使って他の人にバレないようにしましょう。
                 他の人物の秘密の証拠品も掴んでいます。撹乱しましょう。
                 <div className="mt-4">
                  {stuffs && stuffs.length > 0 && (
                    stuffs.map((stuff) => (
                      <span className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded ml-2">{stuff}</span>
                    ))
                  )}
                </div>

              </div>
              </AccordionDetails> 
              <div className="p-5 text-red-800 bg-red-200 rounded italic text-sm">
                {story.confession}
              </div>
            </Accordion>
          ) : (
            <Accordion defaultExpanded className="bg-blue-100 p-4 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <h2 className="text-base font-semibold leading-7 text-blue-900">
                あなたは犯人ではありません。
                </h2>
              </AccordionSummary>
              <AccordionDetails>
              <div className="text-blue-800 rounded">
                自分の秘密がバレないよう立ち回りましょう。
              </div>
              </AccordionDetails> 
            </Accordion>
          )}
            <div>1. まずは事件の詳細とプロフィールを確認してみましょう。</div>
            <Accordion className="p-4 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                事件の詳細
              </AccordionSummary>
              <AccordionDetails className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="text-md font-semibold text-gray-700">舞台： {story.set}</div>
                <p className="mt-2 text-gray-600">{story.body}</p>
                <div className="mt-4">
                  <span className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded">凶器: {story.weapon}</span>
                  <span className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded ml-2">場所: {story.place}</span>
                  <span className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded ml-2">時間: {story.time}</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-700">被害者</h4>
                  <p className="text-gray-600">性別: {story.v_gender}</p>
                  <p className="text-gray-600">性格: {story.v_personality}</p>
                  <p className="text-gray-600">職業: {story.v_job}</p>
                </div>

              </AccordionDetails>
            </Accordion>
            <Accordion className="p-4 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                プロフィール
              </AccordionSummary>
              <AccordionDetails className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="mt-4">
                  <p className="text-gray-600">名前: {character.name}</p>
                  <p className="text-gray-600">性別: {character.gender}</p>
                  <p className="text-gray-600">性格: {character.personality}</p>
                  <p className="text-gray-600">職業: {character.job}</p>
                  <p className="text-gray-600">あなたの証拠品: {character.stuff}</p>
                </div>
                <div className="p-5 text-gray-800 bg-gray-200 rounded italic text-sm">
                {character.introduce}
                </div>
              </AccordionDetails>
            </Accordion>
            <div>2. 次に自分が握っている情報を確認しましょう。</div>
            <Accordion className="p-4 rounded-lg">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
              >
                掴んだ情報
              </AccordionSummary>
              <AccordionDetails className="bg-gray-100 p-4 rounded-lg shadow-md">    
              {character.evidence && character.evidence.length > 0 && (
                <div className="mt-4">
                  {character.evidence.map((evidence, index) => (
                    <div key={index}>
                      <p className="text-gray-600">情報{index + 1}:</p>
                      <div className="p-5 text-gray-800 bg-gray-200 rounded italic text-sm">{evidence}</div>
                    </div>
                  ))}
                </div>
              )}
              </AccordionDetails>
            </Accordion>
            <div>3. 全員が確認できたら話し合いを始めましょう。</div>
            <AccordionActions>
              <DarkButton>解決フェーズに入る</DarkButton>
              <div className="text-base font-semibold leading-7 text-red-900">※犯人が分かるまで押さないようにしてください。</div>
            </AccordionActions>
          </div>
        )}
      </>
    );
  };
  
  export default PlayerShow;