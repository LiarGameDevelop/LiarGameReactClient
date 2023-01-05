import React from 'react';
import { Button, Grid, TextField } from '@mui/material';
import CreateRoomModal from './common/CreateRoomModal'
import HelpModal from './common/HelpModal';

const HomeUI = ({
    createNew, setCreateNew, createRoom, enterExisting, 
    nickname, setNickname, roomCode, setRoomCode, openHelp, setOpenHelp,
}) => {
    const regex = new RegExp("^\\s+$");    
    return (
        <React.Fragment>
            <main>
                <Grid id="home-main" container flexDirection="column" spacing={1}>
                    <Grid item>
                        <Button variant="contained" onClick={()=>setOpenHelp(true)}>
                            게임 방법
                        </Button>
                    </Grid>
                    <Grid item>
                        <TextField
                            label="닉네임 입력(필수)"
                            onChange={(e)=>setNickname(e.target.value)}
                            value={nickname}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="방 코드 입력칸"
                            onChange={(e)=>setRoomCode(e.target.value)}
                            value={roomCode}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" disabled={nickname==''||regex.test(nickname)} onClick={()=>enterExisting()}>
                            입장하기
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" disabled={nickname==''||regex.test(nickname)} onClick={()=>setCreateNew(true)}>
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
            <HelpModal
                open={openHelp}
                close={()=>setOpenHelp(false)}
                helpText={"게임 설명은 여기에"}
            />
        </React.Fragment>
      );
}

export default HomeUI;