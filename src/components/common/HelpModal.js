import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function HelpModal({ open, close, helpText }) {

    return(
        <Dialog
            open={open}
        >
            <DialogTitle>도움말</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {helpText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
}
