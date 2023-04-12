import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Result from '../components/common/ResultModal';

const ResultForm = ({ }) => {
    const { result } = useSelector(({ game }) => {
        return { result: game.result }
      });

    const navigate = useNavigate();

    const rematch = () => {
        navigate("/game");
        console.log("rematch: ");
    }

    const returnHome = () => {
        navigate("/");
        console.log("return home: ");
    }


    return (
    <Result
        result={result}
        rematch={rematch}
        returnHome={returnHome}
    />
    );
};

export default ResultForm;