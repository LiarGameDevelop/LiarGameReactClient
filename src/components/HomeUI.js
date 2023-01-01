import React from 'react';
import { Button, Grid, TextField } from '@mui/material';
import CreateRoomModal from './common/CreateRoomModal'

const HomeUI = ({
    createNew, setCreateNew, createRoom, enterExisting, roomCode, setRoomCode,
}) => {
    return (
        <React.Fragment>
            <main>
                <Grid id="home-main" container flexDirection="column" spacing={1}>
                    <Grid item>
                        <Button variant="contained" onClick={()=>console.log("room code is", roomCode)}>
                            게임 방법
                        </Button>
                    </Grid>
                    <Grid item>
                    <TextField
                        label="방 코드 입력칸"
                        onChange={(e)=>setRoomCode(e.target.value)}
                        value={roomCode}
                    />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={()=>enterExisting()}>
                            입장하기
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={()=>setCreateNew(true)}>
                            방만들기
                        </Button>
                    </Grid>
                </Grid>
            </main>
            <CreateRoomModal
                open={createNew}
                message="방 만들기"
                label="player"
                // value={connections}
                cancel={()=>setCreateNew(false)}
                submit={()=>{
                        setCreateNew(false)
                        createRoom()
                    }
                }
            />
        </React.Fragment>
      );
}

export default HomeUI;