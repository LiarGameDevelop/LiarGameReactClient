import React from 'react';
import { Button, TextField } from '@mui/material';
import CreateRoomModal from './common/CreateRoomModal'
import { Cat, Rule } from '../assets/image'

const HomeUI = ({
    createRoom, enterExisting, state, setState, selectCategory
}) => {
    const regex = new RegExp("^\\s+$");    
    return (
        <React.Fragment>
            <main>
                <div className='divContainer'>
                    <div style={{margin: '0 auto', width: '60%'}}>
                        <Rule width={'100%'}/>
                        <div className='homeCat'><Cat width={'15%'}/></div>
                    </div>
                    <div className='flexContainer'>
                        <div className='marginContainer'>
                            <TextField
                                label="닉네임 입력(필수)"
                                onChange={(e)=>setState({ ...state, nickname: e.target.value })}
                                value={state.nickname}
                            />
                        </div>
                        <div className='marginContainer'>
                            <TextField
                                label="방 코드 입력칸"
                                onChange={(e)=>setState({ ...state, roomCode: e.target.value })}
                                value={state.roomCode}
                            />
                        </div>
                        <div className='marginContainer'>
                            <Button variant="contained" disabled={ state.nickname==='' || regex.test(state.nickname)} onClick={()=>enterExisting()}>
                                입장하기
                            </Button>
                        </div>
                        <div className='marginContainer'>
                            <Button variant="contained" disabled={ state.nickname==='' || regex.test(state.nickname)} onClick={()=>setState({ ...state, createNew: true })}>
                                방만들기
                            </Button>
                        </div>
                    </div>
                </div>
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