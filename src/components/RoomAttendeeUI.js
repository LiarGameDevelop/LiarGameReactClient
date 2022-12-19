import React from 'react';
import { Button, Grid, Paper, TextField } from '@mui/material';

const RoomUI = ({leaveRoom}) => {
    return (
        <main>
            <Grid id="room-main" container spacing={1}>
                <Grid item xs={2}>
                    <Grid container direction="column">
                        <Paper>참여자 1</Paper>
                        <Paper>참여자 2</Paper>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Grid container spacing={1}>
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
                            <TextField
                                onChange={()=>console.log("e")}
                            />
                            <Button variant="contained" onClick={()=>console.log('message 입력')}>
                                전송
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Button variant="contained" onClick={()=>leaveRoom()}>
                        뒤로가기
                    </Button>
                </Grid>
            </Grid>
        </main>
      );
}

export default RoomUI;