import React from 'react';
import { Button, Grid } from '@mui/material';

const ResultUI = ({ membersRanked, rematch, returnHome }) => {
    return (
        <main>
            <Grid id="result-main" container direction="row" justifyContent="space-between">
                <Grid item>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <p>순위 발표</p>
                        </Grid>
                        {
                            Array.from({ length: membersRanked.length },(_,i) =>
                                membersRanked[i] &&
                                <Grid item>
                                    <Grid container direction="row">
                                        <p>{i}</p>
                                        <p>
                                            {membersRanked[i]}
                                        </p>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <Button variant="contained" onClick={returnHome}>
                                방 나가기
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={rematch}>
                                계속하기
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </main>
      );
}

export default ResultUI;