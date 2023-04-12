import React from 'react';
import { Button, CircularProgress, Grid, Paper, TextField } from '@mui/material';
import PlayerCard from './PlayerCard';
import ResultModal from './common/ResultModal';
import { Dog1, Dog2, Dog3, Dog4, Dog5, Dog6, Cat } from '../assets/image'

const PlayerIcon = [<Dog1 width={"60%"}/>, <Dog2 width={"60%"}/>, <Dog3 width={"60%"}/>, <Dog4 width={"60%"}/>, <Dog5 width={"60%"}/>, <Dog6 width={"60%"}/>, <Cat width={"60%"}/>];
const GameUI = ({ isOwner, startGame, leaveTheRoom, members, sendVote, sendMessage, 
    state, setState, result,
}) => {
    let notice;
    switch(state.phase) {
        case 0: notice = "다음 게임을 준비 중입니다."; break;
        case 1: notice = `${state.round} 라운드 진행 중`; break;
        case 2: notice = "채팅창에 힌트를 입력해주세요"; break;
        case 3: notice = "투표를 진행합니다. 라이어의 아이콘을 클릭하세요."; break;
        // case 4: notice = "투표가 종료되었습니다"; break;
        // case 5: notice = `${liarName}님이 라이어로 지목되었습니다.`; break;
        // case 5: notice = `라이어가 지목되었습니다.`; break;
        case 4: notice = `라이어가 정답을 맞추는 중입니다.`; break;
        // case 7: notice = `라운드가 종료되었습니다.`;
    }
    return (
        <React.Fragment>
            <main>
                <Grid container id="game-main" direction="row" alignItems="baseline"  spacing={1}>
                    <Grid item xs={3}>
                        <Grid container direction="column" spacing={1}>
                        {
                            Array.from({ length: (members.length+1)/2 },(_,i) => 
                            <Grid item key={i}>
                                <PlayerCard
                                    icon={members[2*i].userId === state.liar ? PlayerIcon[6] : PlayerIcon[2*i]}
                                    hint={state.hints[2*i]}
                                    name={members[2*i].username}
                                    score={state.scores[2*i]}
                                    click={()=>sendVote(2*i)}
                                />
                            </Grid>
                            )
                        }
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <Paper>
                                    <Grid container id="game-info" direction="column" spacing={1}>
                                        <Grid item>
                                            <Grid container direction="row" alignItems="center" justifyContent="space-between">
                                                <Grid item>
                                                    <p>
                                                        게임정보 {state.round>0 && `라운드 ${state.round} / 턴 ${state.turn && state.turn.username} / 카테고리 ${state.category}`}
                                                    </p>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" disabled={!isOwner} onClick={()=>startGame()}>
                                                        Start
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                                                <Grid item>
                                                    <p>키워드</p>
                                                </Grid>
                                                <Grid item>
                                                    <p>{state.keyword}</p>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
                                                <Grid item>
                                                    <p>{notice}</p>
                                                </Grid>
                                                <Grid item>
                                                    <CircularProgress variant="determinate" value={state.fuse}/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Grid id="texting-area" container direction="column">
                                    <Grid item>{state.chatlog}</Grid>   
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item xs={10}>
                                        <TextField
                                            onChange={(e)=>setState({...state, message:e.target.value})}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    sendMessage()
                                                }
                                            }}
                                            value={state.message}
                                            style={{width:"95%"}}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button variant="contained" onClick={()=>sendMessage()}>
                                            전송
                                        </Button>
                                    </Grid>
                                </Grid>    
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={leaveTheRoom}>
                                    방 나가기
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container direction="column" spacing={1}>
                        {
                            Array.from({ length: members.length/2 },(_,i) => 
                                <PlayerCard
                                    icon={members[2*i + 1].userId === state.liar ? PlayerIcon[6] : PlayerIcon[2*i + 1]}
                                    hint={state.hints[2*i + 1]}
                                    name={members[2*i + 1].username}
                                    score={state.scores[2*i + 1]}
                                    click={()=>sendVote(2*i + 1)}
                                />
                            )
                        }
                        </Grid>
                    </Grid>
                </Grid>
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