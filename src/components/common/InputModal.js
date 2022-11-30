import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';

export default function InputModal({ open, message, label, value, cancel, submit }) {
    const handleInput = (e) => {
        let val = Number(e.target.value);
        if(val>10) {
            val=10;
        }
        if(val<1) {
            val=1;
        }
    }

    return(
        <Dialog
            open={open}
        >
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
                <TextField
                    label={label}
                    type="number"
                    onChange={handleInput}
                    inputProps={{min:1,max:10}}
                    value={value}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} color="primary">
                    취소
                </Button>
                <Button onClick={submit} color="primary">
                    입력
                </Button>
            </DialogActions>
        </Dialog>
    );
}
