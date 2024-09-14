import React from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/user';
import { Outlet } from 'react-router-dom';
import Login from '../login/Login';



const AuthRoutes = () => {
    const user = useRecoilValue(userState)
    return (
      user ? <Outlet /> : <Login/>
    );
};

export default AuthRoutes;