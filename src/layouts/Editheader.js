import React from 'react';

import { userState } from '../recoil/user';
import { useNavigate } from 'react-router-dom';
import { modalActivceState } from '../recoil/channel';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Editlist from './Editlist';
const Editheader = () => {

    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();
const  setActive = useRecoilValue(modalActivceState)
    function logOut(){
        setUser(null)
navigate("/")
    }
    return (

        <div className='header'>
        <h1 className='openH'>
       <Link to='/'>Coup</Link>
       </h1>
        <div className='menu'>
            

         <span> {user ? ( <Link to='/' className='link ' onClick={logOut} >로그아웃</Link>)    :   (<Link to='/join' className='link'>회원가입</Link>)  }     </span>
           <span>{user ? <></> : (<a href="/http://localhost:8123/oauth2/authorization/google" className='link'>로그인</a>)}</span>
           {user ? (<Link to={`/studio/channel/${user.sub}`} className='link' onClick={()=> {setActive(true)}}  > 만들기</Link>) : <></>} 
        </div>
        <Editlist />
    </div>
    
    );
};
export default Editheader;