import React from 'react';
import { Button, CircularProgress, Grid, Paper, TextField } from '@mui/material';

const GameUI = ({leaveTheRoom, toResult, members }) => {
    return (
        <main>
            <Grid container id="game-main" direction="row" alignItems="baseline"  spacing={1}>
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
                                                    <p>icon</p>
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
                                                <Button variant="contained">
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
                                                <p>라이어를 지목해주세요</p>
                                            </Grid>
                                            <Grid item>
                                                <CircularProgress variant="determinate" value={75}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Grid id="texting-area" container direction="column" spacing={1}>
                                <Grid item>
                                    <Grid container direction="row" justifyContent="flex-start">
                                        <Paper>user1</Paper>
                                        <Paper id="other-text">other message</Paper>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction="row" justifyContent="flex-end">
                                        <Paper id="my-text">my message</Paper>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction="row" justifyContent="flex-start">
                                        <Paper>user2</Paper>
                                        <Paper id="other-text">other message</Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center">
                                <Grid item xs={10}>
                                    <TextField
                                        onChange={()=>console.log("e")}
                                        style={{width:"95%"}}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="contained" onClick={()=>console.log('message 입력')}>
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
                                                    <p>icon</p>
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
      );
}

export default GameUI;