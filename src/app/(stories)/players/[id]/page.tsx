"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import ActionCable from 'actioncable';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DarkButton from '@/dark_button';
import InfoIcon from '@mui/icons-material/Info';
import { Fab, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';

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

type Room = {
  id: bigint
  victim: string
}

const PlayerShow = ({ params }: { params: { id: string } }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [stuffs, setStuffs] = useState([])
  const [criminalStuff, setCriminalStuff] = useState("")
  const [solveCount, setSolveCount] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);
  const [solved, setSolved] = useState(false);
  const router = useRouter();
  const { id } = params;
  const [subscription, setSubscription] = useState<ActionCable.Channel>();
  const cable = useMemo(() => {
    return ActionCable.createConsumer(`${process.env.NODE_ENV === 'development' ? 'ws' : 'wss'}://${process.env.NEXT_PUBLIC_API_SERVER_HOST?.replace('https://','').replace('http://','')}/cable`);
  }, []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER_HOST}/players/${id}`)
      .then((res) => res.json())
      .then(({ character, story, stuffs, room, criminal_stuff, solved}) => {
        setStory(story);
        setCharacter(character);
        setStuffs(stuffs);
        setRoom(room);
        setSolveCount(room.solve_count)
        setCriminalStuff(criminal_stuff)
        setSolved(solved)
      });
  }, [room?.id, id]);

  useEffect(() => {
    if (room && id) {
      const sub = cable.subscriptions.create({ channel: "RoomChannel", room_id: room.id }, {
        received: (data) => {
          if (data.type === 'solve') {
            setSolveCount(data.solve_count);
            if (data.player_id === id) {
              removeButtons();
            }
          }
        }
      });
      setSubscription(sub);
      
      return () => {
        sub.unsubscribe();
      };
    }
  }, [cable, room?.id, id]);

  const handleSend = () => {
    subscription?.perform('solve', { room_id: room?.id, player_id: id});
    removeButtons();
  };

  const removeButtons = () => {
    let button = document.getElementById("button_solve");
    let text_alert = document.getElementById("text_alert");
    if (button) {
      button.remove()
    }
    if (text_alert) {
      text_alert.remove()
    }
  }; 

  useEffect(() => {
    if (solveCount === 3) {
      router.push(`/players/${id}/solve`);
    }
  }, [solveCount, router]);

    return (
      <>
        {story && character && room && (
          <div>
           <Fab 
            variant="extended" 
            color="primary" 
            onClick={handleOpen}
            style={{
              position: 'fixed',
              top: isMobile ? 100 : 100,
              right: isMobile ? 16 : 32,
              zIndex: 1000,
              backgroundColor: '#111827'
            }}
          >
            <InfoIcon sx={{ mr: 1 }} />
            hint!
          </Fab>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>ヒント</DialogTitle>
            <DialogContent>
              <p>犯人は自分以外の証拠品を知っています。</p>
              <p>犯人の証拠品は全員が知っています。</p>
              <p>以下のようなことを聞くといいでしょう<div className=""></div></p>
              <p>・「自己紹介しましょう」</p>
              <p>・「なんでXXXにいたんですか？」</p>
              <p>・「何を悩んでいたんですか？」</p>
              <p>・「被害者さんとの関係は？」</p>
              <p>・「被害者さんをどう思っていたんですか？」</p>
              <br/>
              <p>犯人側は下記のようなことに気をつけましょう。</p>
              <p>・職業などは嘘をついた方がいい場合もあります。</p>
              <p>・他の人の証拠品から、秘密の内容を寄せてもいいでしょう。</p>
              <p>・目撃されていても、ある程度事件前と事件後の話を合わせられるように考えましょう。</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
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
                他の人物の秘密の証拠品も掴んでいます。うまく使いましょう。
                <div className="mt-4">
                  {stuffs && stuffs.length > 0 && (
                    stuffs.map((stuff) => (
                      <span className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded ml-2">{stuff}</span>
                    ))
                  )}
                </div>

              </div>
              </AccordionDetails> 
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
                  <p className="text-gray-600">名前: {room.victim}</p>
                  <p className="text-gray-600">性別: {story.v_gender}</p>
                  <p className="text-gray-600">性格: {story.v_personality}</p>
                  <p className="text-gray-600">職業: {story.v_job}</p>
                  <p className="text-red-600">被害者が最後に握っていた犯人のものと思われる証拠: {criminalStuff}</p>
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
            {!solved && (
              <>
              <DarkButton onClick={handleSend} id='button_solve'>解決する</DarkButton>
              <div className="text-base font-semibold leading-7 text-red-900" id='text_alert'>
                <p>※犯人が分かるまで押さないようにしてください。</p>
                <p>　全員が押したら解決フェーズに入ります。</p>
              </div>
              </>
            )}
            <>
              <div>
                <p>{solveCount}人が解決ボタンを押しました。</p>
                <p>全員が揃ったら回答を始めます。</p>
              </div>
            </>
            </AccordionActions>
          </div>
        )}
      </>
    );
  };
  
  export default PlayerShow;