import React from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import PlayerCard from './PlayerCard';
import ResultModal from './common/ResultModal';
import { Dog1, Dog2, Dog3, Dog4, Dog5, Dog6, Cat } from '../assets/image'

const PlayerIcon = [<Dog1 width={"60%"}/>, <Dog2 width={"60%"}/>, <Dog3 width={"60%"}/>, <Dog4 width={"60%"}/>, <Dog5 width={"60%"}/>, <Dog6 width={"60%"}/>, <Cat width={"60%"}/>];
const GameUI = ({ isOwner, startGame, leaveTheRoom, members, sendTurnEnd, sendVote, sendMessage,
    state, setState, result,
}) => {
    let notice;
    switch(state.phase) {
        case 0: notice = "다음 게임을 준비 중입니다."; break;
        case 1: notice = `${state.round} 라운드 진행 중`; break;
        case 2: notice = "채팅창에 힌트를 입력해주세요"; break;
        case 3: notice = "투표를 진행합니다. 라이어의 아이콘을 클릭하세요."; break;
        case 4: notice = "라이어가 정답을 맞추는 중입니다."; break;
        default: break;
    }
    return (
        <React.Fragment>
            <main>
                <div>
                    <div id="game-main">
                        <div id="player-container">
                        {Array.from({ length: (members.length+1)/2 },(_,i) => 
                            <PlayerCard
                                key={i}
                                icon={members[2*i].userId === state.liar ? PlayerIcon[6] : PlayerIcon[2*i]}
                                hint={state.hints[2*i]}
                                name={members[2*i].username}
                                score={state.scores[2*i]}
                                click={()=>sendVote(2*i)}
                            />
                        )}
                        </div>
                        <div id="gameinfo-container">
                            <div id="game-info">
                                <div id="board-item-container">
                                    <p>
                                        게임정보 {state.round>0 && `라운드 ${state.round} / 턴 ${state.turn && state.turn.username} / 카테고리 ${state.category}`}
                                    </p>
                                    <div>
                                        <Button variant="contained" disabled={!isOwner} onClick={()=>startGame()} id="button-area">
                                            Start
                                        </Button>
                                        <Button variant="contained" onClick={leaveTheRoom} id="button-area">
                                            방 나가기
                                        </Button>
                                    </div>
                                </div>
                                <div id="board-item-container">
                                    <p>키워드</p>
                                    <p>{state.keyword}</p>
                                </div>
                                <div id="board-item-container">
                                    <p>{notice}</p>
                                    <CircularProgress variant="determinate" value={state.fuse}/>
                                </div>
                            </div>
                            <div id="input-area">
                                <div id="texting-area">{state.chatlog}</div>
                                <div id="input-button">
                                    <TextField
                                        onChange={(e)=>setState({...state, message:e.target.value})}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                sendMessage()
                                            }
                                        }}
                                        value={state.message}
                                        style={{width:"90%", marginRight: '5px'}}
                                    />
                                    <Button variant="contained" onClick={()=>sendMessage()} style={{width: "10%"}}>
                                        전송
                                    </Button>
                                    <Button variant="contained" disabled={state.phase!==2} onClick={()=>sendTurnEnd()} style={{width: "10%"}}>
                                        턴 종료
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div id="player-container">
                            {Array.from({ length: members.length/2 },(_,i) => 
                                <PlayerCard
                                    icon={members[2*i + 1].userId === state.liar ? PlayerIcon[6] : PlayerIcon[2*i + 1]}
                                    hint={state.hints[2*i + 1]}
                                    name={members[2*i + 1].username}
                                    score={state.scores[2*i + 1]}
                                    click={()=>sendVote(2*i + 1)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <ResultModal
                result={result}
                state={state}
                setState={setState}
            />
       </React.Fragment>
      );
}

export default GameUI;