import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Button } from '@mui/material';

const ResultModal = ({ result, state, setState }) => {
    // For Testers: 결과 팝업에 넣을 더미 결과. 서버에서 받은 값 이미 내림차순으로 정렬해서 받기 때문에 정렬은 필요없음.
    const dummyResult = { rankings: [{ username: "요환", score: 12 }, { username: "진호", score: 7 }, { username: "영희", score: 5 }, { username: "꼴찌민수", score: 2 }]};
    
    return (
        <Dialog
            open={state.showResult}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle>
                순위 발표
            </DialogTitle>
            <DialogContent>
                <Grid id="result-main" container direction="row" justifyContent="space-between">
                    <Grid item>
                        <Grid container direction="column" spacing={1}>
                            {
                                Array.from(dummyResult.rankings,(_,i) =>
                                    <Grid item key={i}>
                                        <Grid container direction="row">
                                            <div id="rank">{i+1}</div>
                                            <div id="rank-score">{dummyResult.rankings[i].username} : {dummyResult.rankings[i].score}</div>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={()=>setState({ ...state, showResult: false })}>
                    돌아가기
                </Button>
            </DialogActions>
        </Dialog>
      );
}

export default ResultModal;