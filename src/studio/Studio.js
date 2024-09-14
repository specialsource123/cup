import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Channel from './Channel';
import VideoEditor from './VideoEditor';

const Studio = () => {
    return (
       <Routes>
        <Route path='/channel/:id' element={< Channel/>} />
        <Route path='/channel/video/:id/edit' element={< VideoEditor/>} />
       </Routes>
    );
};

export default Studio;