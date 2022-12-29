import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Result from '../components/ResultUI';

const ResultForm = ({ }) => {
    // const dispatch = useDispatch();
    // const { connectionInfo } = useSelector(({ room }) => {
    //   return { connectionInfo: room.connectionInfo }
    // });

    const navigate = useNavigate();

    const membersRanked = ["철수", "영희", "민수", "Jhon", "kevu", "mike" ];
    //어떻게 받아올지는 연구 필요

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
        membersRanked={membersRanked}
        rematch={rematch}
        returnHome={returnHome}
    />
    );
};

export default ResultForm;