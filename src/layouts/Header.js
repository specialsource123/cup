import React from 'react';
import { Link } from 'react-router-dom'
import {  useRecoilState} from 'recoil';
import { userState } from '../recoil/user';
import { useNavigate } from 'react-router-dom';
import { modalActivceState } from '../recoil/channel';
import List from './List';
const Header = () => {

    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();
const [active, setActive] = useRecoilState(modalActivceState)
    function logOut(){
        setUser(null)
navigate("/")
    }
    return (

        <div className='header'>
        <h1 className='openH'>
       <Link to='/'>1234</Link>
       </h1>
        <div className='menu'>
            
         <span> {user ? ( <Link to='/' className='link ' onClick={logOut} >로그아웃</Link>)    :   (<Link to='/join' className='link'>회원가입</Link>)  }     </span>
           <span>{user ? <></> : (<a href="http://localhost:8123/oauth2/authorization/google" className='link'>로그인</a>)}</span>
           {user ? (<Link to={`/studio/channel/${user.sub}`} className='link' onClick={()=> {setActive(true)}}  > 만들기</Link>) : <></>} 
        </div>
    <List />
    </div>
    
    );
};

export default Header;