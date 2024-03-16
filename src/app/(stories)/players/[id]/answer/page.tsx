"use client";

import React, { useState, useEffect } from "react";
import { styled, keyframes } from "@mui/system";

const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const AdditionalText = styled("div")<{ delay: number }>`
  opacity: 0;
  animation: ${fadeInKeyframes} 4s ease-in-out forwards;
  animation-delay: ${({ delay }) => delay}s;
`;

const Answer = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [text, setText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [criminalWin, setCriminalWin] = useState<boolean | null>(null);
  const [confession, setConfession] = useState<string | null>(null);
  const [isCriminal, setIsCriminal] = useState<boolean | null>(null);
  const [showConfession, setShowConfession] = useState<boolean>(false);
  const innocent_win = "あなたたちは犯人を突き止めました。";
  const innocent_lose = "あなたたちは犯人をこれ以上追及できませんでした。";
  const criminal_win = "あなたは追及を逃れ切りました。";
  const criminal_lose = "あなたは犯人として特定されてしまいました。";
  let result = "";

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/players/${id}/result`)
      .then((res) => res.json())
      .then(({ room_id, is_criminal, criminal_win, confession }) => {
        setRoomId(room_id);
        setCriminalWin(criminal_win);
        setConfession(confession);
        setIsCriminal(is_criminal);
      });
  }, [roomId, id]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (criminalWin && isCriminal) {
      result = criminal_win;
    } else if (criminalWin && !isCriminal) {
      result = innocent_lose;
    } else if (!criminalWin && isCriminal) {
      result = criminal_lose;
    } else if (!criminalWin && !isCriminal) {
      result = innocent_win;
    }    
    if (!showConfession) {
      interval = setInterval(() => {
        setText(result.slice(0, index + 1));
        setIndex((prevIndex) => prevIndex + 1);
      }, 100);

      if (index >= result.length) {
        clearInterval(interval);
        setShowConfession(true);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [index, result, showConfession]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-2xl font-bold mb-4">結末</div>
      <div className="text-lg mb-8 text-center">
        {text}
        {showConfession && (
          <>
            {criminalWin && !isCriminal && (
              <>
                <AdditionalText delay={0}>
                  犯人にもこちらの弱みを握られてしまったようだ。
                  もう警察に言うことはできない。
                  犯人はそれもあって被害者殺害についてこう語った。
                </AdditionalText>
                <AdditionalText delay={2}>{confession}</AdditionalText>
              </>
            )}
            {criminalWin && isCriminal && (
              <>
                <AdditionalText delay={0}>{confession}</AdditionalText>
                <AdditionalText delay={2}>
                  向こうの証拠品は握ってある。別に問題ないだろう。
                </AdditionalText>
              </>
            )}
            {!criminalWin && isCriminal && (
              <>
                <AdditionalText delay={0}>{confession}</AdditionalText>
                <AdditionalText delay={2}>
                  警察の前で、項垂れて語るほかなかった..
                </AdditionalText>
              </>
            )}
            {!criminalWin && !isCriminal && (
              <>
                <AdditionalText delay={0}>
                  {confession}
                  <br />
                  犯人は警察に捕まり、そう語った。
                </AdditionalText>
                <AdditionalText delay={2}>
                  同情する部分はあるが、あまり知られたくないこともあるし、解決できて良かった..
                </AdditionalText>
              </>
            )}
            <AdditionalText delay={4}>
              <div>-終わり-</div>
            </AdditionalText>
            <AdditionalText delay={6}>
              <div>お疲れ様でした！各々のなりきり度についても話して見てくださいね。</div>
            </AdditionalText>
          </>
        )}
      </div>
    </div>
  );
};

export default Answer;