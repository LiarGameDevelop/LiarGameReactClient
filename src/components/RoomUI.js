import React from 'react';
import { Button, Grid } from '@mui/material';

const RoomUI = ({leaveRoom}) => {
    return (
        <main>
            <Grid id="room-main" container spacing={1}>
                <Grid item>
                    <Button variant="contained">
                        send
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={()=>leaveRoom()}>
                        뒤로가기
                    </Button>
                </Grid>
            </Grid>
        </main>
      );
}

export default RoomUI;