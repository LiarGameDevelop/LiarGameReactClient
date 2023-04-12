import React from 'react';
import { Button, Grid, TextField } from '@mui/material';
import CreateRoomModal from './common/CreateRoomModal'
import { Cat, Rule } from '../assets/image'

const HomeUI = ({
    createRoom, enterExisting, state, setState, selectCategory
}) => {
    const regex = new RegExp("^\\s+$");    
    return (
        <React.Fragment>
            <main>
                <Grid id="home-main" container flexDirection="column" spacing={1}>
                    <Grid item>
                        <Cat />
                    </Grid>
                    <Grid item>
                        <Rule />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="닉네임 입력(필수)"
                            onChange={(e)=>setState({ ...state, nickname: e.target.value })}
                            value={state.nickname}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="방 코드 입력칸"
                            onChange={(e)=>setState({ ...state, roomCode: e.target.value })}
                            value={state.roomCode}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" disabled={ state.nickname=='' || regex.test(state.nickname)} onClick={()=>enterExisting()}>
                            입장하기
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" disabled={ state.nickname=='' || regex.test(state.nickname)} onClick={()=>setState({ ...state, createNew: true })}>
                            방만들기
                        </Button>
                    </Grid>
                </Grid>
            </main>
            <CreateRoomModal
                state={state}
                setState={setState}
                message="방 만들기"
                label="player"
                // value={connections}
                selectCategory={selectCategory}
                cancel={()=>setState({ ...state, createNew: false })}
                submit={()=>{
                        setState({ ...state, createNew: false })
                        createRoom()
                    }
                }
            />
        </React.Fragment>
      );
}

export default HomeUI;