import React from 'react';
import { Paper } from '@mui/material';

const PlayerCard = ({ icon, hint, name, score, click }) => {
    return (
        <Paper id="player-card">
            <div id="player-card-level-0">
                <div id="player-card-level-1">
                    <div id="icon-box" onClick={click}>
                        {icon}
                    </div>
                    <div className="hint-box">
                        <pre>{hint}</pre>
                    </div>
                </div>
                <div id="player-card-level-1">
                    <div id="icon-box">
                        <p>{name}</p>
                    </div>
                    <div id="icon-box">
                        <p>{score}</p>
                    </div>
                </div>
            </div>
        </Paper>
    )
}

export default PlayerCard;