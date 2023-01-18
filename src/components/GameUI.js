import React from 'react';
import { Button, CircularProgress, Grid, Paper, TextField } from '@mui/material';
import { Person } from '@mui/icons-material'
import InputModal from './common/InputModal'

const GameUI = ({ isOwner, startGame, leaveTheRoom, toResult, members, phase, hints, submitHint, sendVote, 
    liar, mustAnswer, answer, setAnswer, submitAnswer, fuse,
    message, setMessage, sendMessage, chatlog 
}) => {
    let notice;
    switch(phase) {
        case 0: notice = "게임 시작 전 대기"; break;
        case 1: notice = "라운드 진행 중"; break;
        case 2: notice = "채팅창에 힌트를 입력해주세요"; break;
        case 3: notice = "라이어를 지목해주세요. 라이어의 아이콘을 클릭"; break;
        case 4: notice = "투표가 종료되었습니다"; break;
        case 5: notice = `${liar}님이 라이어로 지목되었습니다.`;
        case 6: notice = `${liar}님은 라이어가 맞습니다. 정답을 맞추는 중입니다.`;
    }
    return (
        <React.Fragment>
            <main>
                <Grid container id="game-main" direction="row" alignItems="baseline"  spacing={1}>
                    <Grid item xs={3}>
                        <Grid container direction="column" spacing={1}>
                        {
                            Array.from({ length: members.length/2 },(_,i) => 
                                <Grid item key={i}>
                                    <Paper >
                                        <Grid container direction="column">
                                            <Grid item>
                                                <Grid container direction="row" justifyContent="space-around" alignItems="center">
                                                    <Grid item>
                                                        <Person id={`player${2*i}`} fontSize='large' onClick={()=>sendVote(2*i)} />
                                                    </Grid>
                                                    <Grid item>
                                                        <Paper>
                                                            hint
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container direction="row" justifyContent="space-around">
                                                    <Grid item>
                                                        <p>{members[2*i]}</p>
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
                                                    <p>게임정보</p>
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
                                                    <p>
                                                        keyword
                                                    </p>
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
                                    <p id="player0">user1:하드 코딩된 대화문 시작</p>
                                    <p id="player1">user2: ㅎㅇㅎㅇ</p>
                                    <p id="player2">user3: ㅎㅇㅎㅇ</p>
                                    {chatlog}
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item xs={10}>
                                        <TextField
                                            onChange={(e)=>setMessage(e.target.value)}
                                            value={message}
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
                                                    <Grid item>
                                                        <Person id={`player${2*i + 1}`} fontSize='large' onClick={()=>sendVote(2*i + 1)} />
                                                    </Grid>
                                                    <Grid item>
                                                        <Paper>
                                                            hint
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container direction="row" justifyContent="space-around">
                                                    <Grid item>
                                                        <p>{members[2*i + 1]}</p>
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
            {/* <InputModal
                open={phase==2}
                message="키워드는 ---. 힌트를 주세요(구현 중)."
                value={hints[0]}
                handleInput={()=>console.log("must implement")}
                submit={submitHint}
            /> */}
            <InputModal
                open={mustAnswer}
                message="라이어로 지목되었습니다. 정답을 맞춰주세요."
                value={answer}
                handleInput={setAnswer}
                submit={submitAnswer}
            />
        </React.Fragment>
      );
}

export default GameUI;