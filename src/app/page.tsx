"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { styled } from "@mui/system";
import { useEffect, useState } from "react";

type Story = {
  id: bigint
  name: string;
  set: string;
  body: string;
};

const StoryIndex = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const router = useRouter();

  useEffect(() => {
    try{
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/stories`)
      .then((res) => res.json())
      .then((stories) => setStories(stories));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);
  
  const getRoom = async () => {
    try {
      router.replace(`/rooms/new`);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw(error)
    }
  };

  const Container = styled("div")({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  const DarkButton = styled(Button)({
    backgroundColor: "#111827",
    color: "#69717f", // 文字色を白に設定
    "&:hover": {
      backgroundColor: "black",
      
    },
  });

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <h3 id="details-heading" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          オリジナルのマダミスで遊ぼう
        </h3>
        <p className="mt-3 max-w-3xl text-lg text-gray-600">
        "まあ、皆さん落ち着きましょう。"
        </p>
        <p className="mt-3 max-w-3xl text-lg text-gray-600">
        "どうやら犯人は私たちの中にいるようですね。"
        </p>
        <p className="mt-3 max-w-3xl text-lg text-gray-600">
        ”お互い警察に知られたくないようなこともあるでしょうし...”
        </p>
        <p className="mt-3 max-w-3xl text-lg text-gray-600">
        "どうでしょう？犯人を私たちで見つけませんか？"
        </p>
      </div>
      <Container sx={{ margin: '8px'}} className='flex flex-col items-center text-center'>
        <DarkButton
          variant="contained"
          color="primary"
          size="large"
          className=" w-80"
          startIcon={<AutoStoriesIcon />}
          onClick={() => getRoom()}
        >
          物語を自動生成する！
          
        </DarkButton>
        <p className="text-gray-600">(3人で遊べます)</p>
      </Container>
    
      <Container sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', height: '100%', margin: '8px'}}>
        <div className="mt-3 max-w-3xl text-lg text-gray-600">みんなの生成したストーリー</div>
        {stories && (
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories && stories.length > 0 && stories.map((story) => (
              <li key={story.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-[#111827] shadow">
                <div className="flex flex-col h-full">
                  <div className="flex-1 p-6">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-500">{story.name}</h3>

                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-red-200 px-1.5 py-0.5 text-xs font-medium text-red-800 ring-1 ring-inset ring-red-600/20">
                        {story.set}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 overflow-hidden" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}>
                      {story.body}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="flex w-0 flex-1">
                        <a
                          href={`/rooms/new?story=${story.id}`}
                          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border-t border-l border-r border-gray-200 py-4 text-sm font-semibold text-gray-500"
                        >
                          この物語で遊ぶ！
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
};
  
  export default StoryIndex;