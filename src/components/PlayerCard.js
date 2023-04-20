import React from 'react';
import {Paper} from '@mui/material';

import bone from '../assets/image/bone.png';

const PlayerCard = ({ icon, hint, name, score, click }) => {
    // score = 10
    return (
        <Paper id="player-card">
            <div id="player-card-level-0">
                <div id="player-card-level-0-1">
                    <div id="character-div" onClick={click}>
                        {icon}
                    </div>
                    <div id="name-box">{name}</div>
                </div>
                <div className="hint-box">
                    <pre>{hint}</pre>
                </div>
            </div>
            <div id="player-card-level-1">
                <div id="icon-box">
                    <div style={{marginRight: '10px'}}>score({score})- </div>
                    {/* {Array(score).fill(<img src={bone} alt={'boneImg'} height={'75%'}/>)} */}
                </div>
            </div>
        </Paper>
    )
}

export default PlayerCard;