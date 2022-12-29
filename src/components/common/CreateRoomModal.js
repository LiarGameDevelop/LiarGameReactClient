import React, { useState } from 'react';
import { 
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    FormControl, Grid
} from '@mui/material';

export default function CreateRoomModal({ open, message, cancel, submit }) {
    const [person, setPerson] = useState(4);
    const [round, setRound] = useState(3);
    const [hint, setHint] = useState(3);

    //state로 처리할지 여부 판단 필요
    const topics = [
        "주제1", "주제2", "긴문자열~~ 주제", "주제4", "주제5", "주제6", "ex", "매우~~~~긴~~~~~~~주제"
    ];

    return(
        <Dialog
            open={open}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle>
                {message}
            </DialogTitle>
            <DialogContent>
                <Grid container id="create-parameters">
                    <DialogContentText id="parameter-label">인원 수</DialogContentText>
                    <Button id="round-button" variant='contained' onClick={()=>setPerson(person-1)} disabled={person<=2}>
                        -
                    </Button>
                    <DialogContentText id="parameter-value">{person}</DialogContentText>
                    <Button id="round-button" variant='contained' onClick={()=>setPerson(person+1)} disabled={person>=6}>
                        +
                    </Button>
                </Grid>
                <Grid container id="create-parameters">
                    <DialogContentText id="parameter-label">라운드 수</DialogContentText>
                    <Button id="round-button" variant='contained' onClick={()=>setRound(round-1)} disabled={round<=1}>
                        -
                    </Button>
                    <DialogContentText id="parameter-value">{round}</DialogContentText>
                    <Button id="round-button" variant='contained' onClick={()=>setRound(round+1)} disabled={round>=6}>
                        +
                    </Button>
                </Grid>
                <Grid container id="create-parameters">
                    <DialogContentText id="parameter-label">라운드-힌트 수</DialogContentText>
                    <Button id="round-button" variant='contained' onClick={()=>setHint(hint-1)} disabled={round<=1}>
                        -
                    </Button>
                    <DialogContentText id="parameter-value">{hint}</DialogContentText>
                    <Button id="round-button" variant='contained' onClick={()=>setRound(hint+1)} disabled={round>=6}>
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
