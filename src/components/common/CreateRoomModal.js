import React from 'react';
import { 
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, Grid
} from '@mui/material';

export default function CreateRoomModal({ state, setState, message, cancel, submit }) {

    //state로 처리할지 여부 판단 필요
    const topics = [
        "주제1", "주제2", "긴문자열~~ 주제", "주제4", "주제5", "주제6", "ex", "매우~~~~긴~~~~~~~주제"
    ];

    return(
        <Dialog
            open={state.createNew}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle>
                {message}
            </DialogTitle>
            <DialogContent>
                <Grid container id="create-parameters">
                    <DialogContentText id="parameter-label">인원 수</DialogContentText>
                    <Button id="round-button" variant='contained'
                        onClick={()=>setState({ ...state, maxPersonCount: state.maxPersonCount - 1 })} disabled={state.maxPersonCount <= 2}
                    >
                        -
                    </Button>
                    <DialogContentText id="parameter-value">{state.maxPersonCount}</DialogContentText>
                    <Button id="round-button" variant='contained'
                        onClick={()=>setState({ ...state, maxPersonCount: state.maxPersonCount + 1 })} disabled={state.maxPersonCount >= 6}
                    >
                        +
                    </Button>
                </Grid>
                <Grid container id="create-parameters">
                    <DialogContentText id="parameter-label">라운드 수</DialogContentText>
                    <Button id="round-button" variant='contained'
                        onClick={()=>setState({ ...state, maxRound: state.maxRound - 1 })} disabled={state.maxRound<=1}
                    >
                        -
                    </Button>
                    <DialogContentText id="parameter-value">{state.maxRound}</DialogContentText>
                    <Button id="round-button" variant='contained'
                        onClick={()=>setState({ ...state, maxRound: state.maxRound + 1 })} disabled={state.maxRound>=6}
                    >
                        +
                    </Button>
                </Grid>
                <Grid container id="create-parameters">
                    <DialogContentText id="parameter-label">라운드-힌트 수</DialogContentText>
                    <Button id="round-button" variant='contained'
                        onClick={()=>setState({ ...state, maxHint: state.maxHint - 1 })} disabled={state.maxHint<=1}
                    >
                        -
                    </Button>
                    <DialogContentText id="parameter-value">{state.maxHint}</DialogContentText>
                    <Button id="round-button" variant='contained'
                        onClick={()=>setState({ ...state, maxHint: state.maxHint + 1 })} disabled={state.maxHint>=6}
                    >
                        +
                    </Button>
                </Grid>
                <DialogContentText id="parameter-label">주제</DialogContentText>
                <Grid container id="create-parameters" rowSpacing={1}> 
                    {
                        Array.from({ length: topics.length },(_,i) => 
                            <Grid item xs={3} key={i}>
                                <Button variant="contained" style={{ width: "90%" }}>
                                    {topics[i]}
                                </Button>
                            </Grid>
                        )
                    }
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} color="primary">
                    취소
                </Button>
                <Button onClick={submit} color="primary">
                    생성
                </Button>
            </DialogActions>
        </Dialog>
    );
}
