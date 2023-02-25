import React from 'react';
import { Button, CircularProgress, Grid, Paper, TextField } from '@mui/material';
import { Dog1, Dog2, Dog3, Dog4, Dog5, Dog6, Cat } from '../assets/image'

const PlayerIcon = [<Dog1 />, <Dog2 />, <Dog3 />, <Dog4 />, <Dog5 />, <Dog6 />, <Cat />];
const GameUI = ({ isOwner, startGame, leaveTheRoom, toResult, members, 
    round, turn, hints,
    sendVote, liar, fuse,
    sendMessage, state, setState,
}) => {
    let notice;
    // let liarName = liar && members.length > 0 ? members.find((e)=>e.userId === liar).username : "";
    switch(state.phase) {
        case 0: notice = "게임 시작 전 대기"; break;
        case 1: notice = "라운드 진행 중"; break;
        case 2: notice = "채팅창에 힌트를 입력해주세요"; break;
        case 3: notice = "라이어를 지목해주세요. 라이어의 아이콘을 클릭"; break;
        case 4: notice = "투표가 종료되었습니다"; break;
        case 5: notice = `${liar}님이 라이어로 지목되었습니다.`; break;
        case 6: notice = `${liar}님은 라이어가 맞습니다. 정답을 맞추는 중입니다.`; break;
        case 7: notice = `라운드가 종료되었습니다.`;
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
                                <Paper >
                                    <Grid container direction="column">
                                        <Grid item>
                                            <Grid container direction="row" justifyContent="space-around" alignItems="center">
                                                <Grid item onClick={()=>sendVote(2*i)}>
                                                    {members[2*i].userId === liar ? PlayerIcon[6] : PlayerIcon[2*i]}
                                                </Grid>
                                                <Grid item>
                                                    <Paper>
                                                        <pre>{hints[2*i]}</pre>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container direction="row" justifyContent="space-around">
                                                <Grid item>
                                                    <p>{members[2*i].username}</p>
                                                </Grid>
                                                <Grid item>
                                                    <p>승점</p>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
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
                                                        게임정보 {round>0 && `라운드 ${round} / 턴 ${turn && turn.username} / 카테고리 ${state.category}`}
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
                                                    <CircularProgress variant="determinate" value={fuse}/>
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
                                <Button variant="contained" onClick={toResult}>
                                    결과로-to be removed
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={leaveTheRoom}>
                                    방 나가기-to be removed
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container direction="column" spacing={1}>
                        {
                            Array.from({ length: members.length/2 },(_,i) => 
                                <Grid item key={i}>
                                    <Paper>
                                        <Grid container direction="column">
                                            <Grid item>
                                                <Grid container direction="row" justifyContent="space-around" alignItems="center">
                                                    <Grid item onClick={()=>sendVote(2*i + 1)}>
                                                        {members[2*i + 1].userId === liar ? PlayerIcon[6] : PlayerIcon[2*i + 1]}
                                                    </Grid>
                                                    <Grid item>
                                                        <Paper>
                                                            <pre>{hints[2*i + 1]}</pre>
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container direction="row" justifyContent="space-around">
                                                    <Grid item>
                                                        <p>{members[2*i + 1].username}</p>
                                                    </Grid>
                                                    <Grid item>
                                                        <p>승점</p>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            )
                        }
                        </Grid>
                    </Grid>
                </Grid>
            </main>
        </React.Fragment>
      );
}

export default GameUI;