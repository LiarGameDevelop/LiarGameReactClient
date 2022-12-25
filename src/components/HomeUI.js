import React from 'react';
import { Button, Grid } from '@mui/material';
import CreateRoomModal from './common/CreateRoomModal'
import InputModal from './common/InputModal'

const HomeUI = ({ createNew, setCreateNew, openExisting, setOpenExisting, createRoom, enterRoom }) => {
    return (
        <React.Fragment>
            <main>
                <Grid id="home-main" container spacing={1}>
                    <Grid item>
                        <Button variant="contained" onClick={()=>setCreateNew(true)}>
                            신규 방 생성
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={()=>setOpenExisting(true)}>
                            기존 방 입장
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
            <InputModal
                open={openExisting}
                message="room-id를 입력하십시오."
                label="room-id"
                // value={connections}
                cancel={()=>setOpenExisting(false)}
                submit={()=>{
                        setOpenExisting(false)
                        enterRoom()
                    }
                }
            />
        </React.Fragment>
      );
}

export default HomeUI;