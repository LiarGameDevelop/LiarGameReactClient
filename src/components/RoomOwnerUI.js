import React from 'react';
import { Button, Grid, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Paper, TextField } from '@mui/material';

const RoomUI = ({leaveRoom, roomNo, category, setCategory, numOfRound, setRounds, numOfHint, setHints}) => {
    return (
        <main>
            <Grid id="room-main" container spacing={1}>
                <Grid item xs={2}>
                    <Grid container direction="column" alignItems="center">
                        <p>참여자 목록</p>
                        <Paper>참여자 1</Paper>
                        <Paper>참여자 2</Paper>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Grid container direction="column" spacing={1}>
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
                            <FormControl style={{"flexDirection":"row"}}>
                                <TextField
                                    onChange={()=>console.log("e")}
                                />
                                <Button variant="contained" onClick={()=>console.log('message 입력')}>
                                    전송
                                </Button>
                            </FormControl>    
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Grid container direction="column" alignItems="center" spacing={1}>
                        <Grid item>
                            <p>{category}</p>
                            <Button variant="contained" onClick={()=>console.log("category popup?")}>
                                카테고리
                            </Button>
                        </Grid>
                        <Grid item>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Round 수</FormLabel>
                                <RadioGroup id="radio-row" name="rounds" value={numOfRound} onChange={(e)=>setRounds(e.target.value)}>
                                    <FormControlLabel value={3} control={<Radio />} label="3" />
                                    <FormControlLabel value={5} control={<Radio />} label="5" />
                                    <FormControlLabel value={7} control={<Radio />} label="7" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Round 당 hint 수</FormLabel>
                                <RadioGroup id="radio-row" name="hints" value={numOfHint} onChange={(e)=>setHints(e.target.value)}>
                                    <FormControlLabel value={1} control={<Radio />} label="1" />
                                    <FormControlLabel value={2} control={<Radio />} label="2" />
                                    <FormControlLabel value={3} control={<Radio />} label="3" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Grid container flexDirection="column" spacing={1}>
                                <Grid item>
                                    <Button variant="contained" onClick={()=>console.log("start game")}>
                                        게임 시작하기
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" onClick={()=>leaveRoom()}>
                                        방 나가기
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>   
                    </Grid>
                </Grid>
            </Grid>
        </main>
      );
}

export default RoomUI;