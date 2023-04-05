import React from 'react';
import { 
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid
} from '@mui/material';

export default function CreateRoomModal({ state, setState, message, cancel, submit, selectCategory }) {

    //state로 처리할지 여부 판단 필요
    const topics = [
        "animal", "celebrity", "food", "place", "sports",
    ];

    return(
        <Dialog
            open={state.createNew}
            maxWidth="lg"
            PaperProps={{style: { borderRadius: 20 }}}
        >
            <DialogTitle style={{textAlign:'center', fontWeight: 800}}>
                {message}
            </DialogTitle>
            <DialogContent >
                <Grid container id="create-parameters" justifyContent="center">
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
                <Grid container id="create-parameters"  justifyContent="center">
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
                <Grid container id="create-parameters"  justifyContent="center">
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
                <Grid container justifyContent="center" columns={20} style={{marginTop: '30px'}}> 
                    {
                        Array.from({ length: topics.length },(_,i) => 
                            <Grid item xs={4} key={i}>
                                <Button variant="contained" style={{ width: "95%"}}
                                    id={ state.category.find((e)=>e===topics[i]) ? "selected" :"unselected"}
                                    onClick={()=>selectCategory(topics[i])}
                                >
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
