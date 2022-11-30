import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Home from '../components/HomeUI';

const HomeForm = ({ }) => {
    const roomNo = useParams().roomNo;
    const navigate = useNavigate();
    const enterRoom = () => {
        navigate("/room");
        console.log("enter room");
    }

    const [createNew,setCreateNew] = useState(false);
    const [openExisting,setOpenExisting] = useState(false);


    return (
    <Home
        createNew={createNew}
        setCreateNew={setCreateNew}
        openExisting={openExisting}
        setOpenExisting={setOpenExisting}
        enterRoom={enterRoom}
    />
    );
};

export default HomeForm;