
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { backend_url } from "../utils";


export default function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");



    async function onSubmit (e){
        e.preventDefault();
        try {
           const response = await fetch(`${backend_url}/api/v1/user/join`,{
                method : "POST",
                headers: {  "Content-Type" : "application/json", },
                body: JSON.stringify({
                     email : email,
                     password : password,
                     username : username,
                }),
            })
            if(!response.ok){
                throw new Error('회원가입에 실패했습니다')
            }
            console.log(response)
            alert('회원가입 성공!')
            navigate('/')
        } catch (e) {
            alert('회원가입에 실패했습니다')
        }
        finally{
            setUsername('');
            setEmail('');
            setPassword('');
        }
    
    }
    
    
    
    






return(
    <div>
<div className="LogTop">
    <h1><Link to="/">1234</Link></h1>
    <form  className="LogTop" onSubmit={onSubmit}>

     <input type="email" placeholder="email을 입력해주세요"  className="logMe"  value={email} onChange={(e)=> {setEmail(e.target.value)}}/>
     <input type="text" placeholder="닉네임을 입력해주세요"  className="logMe"  value={username} onChange={(e)=> {setUsername(e.target.value)}}/>
     <input type="text" placeholder="비밀번호를 입력해주세요"  className="logMe" value={password} onChange={(e)=> {setPassword(e.target.value)}}/>
     <button type="submit" className="logBtn">전송</button>
    </form>
</div>
</div>
);
    }