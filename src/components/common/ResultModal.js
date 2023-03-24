import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Button } from '@mui/material';

const ResultUI = ({ result, state, setState }) => {
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
                                Array.from(result.rankings,(_,i) =>
                                    <Grid item>
                                        <Grid container direction="row">
                                            <p>{i+1}. {result.rankings[i].username} : {result.rankings[i].score}
                                            </p>
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

export default ResultUI;