import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';

export default function InputModal({ open, message, value, handleInput, submit }) {


    return(
        <Dialog
            open={open}
        >
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
                <TextField
                    onChange={(e)=>handleInput(e.target.value)}
                    value={value}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>submit(value)} color="primary">
                    입력
                </Button>
            </DialogActions>
        </Dialog>
    );
}
