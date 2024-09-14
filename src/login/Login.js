import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/user";
import { backend_url } from "../utils";


export default function Join() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useRecoilState(userState);

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${backend_url}/api/v1/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            if (!response.ok) {
                throw new Error('로그인에 실패했습니다');
            }
            const responseData = await response.json();
            console.log(responseData);
            setUser(responseData);
            alert('로그인 성공!');
            navigate('/');
        } catch (e) {
            alert('로그인에 실패했습니다');
        } finally {
            setPassword('');
            setEmail('');
        }
    }

    return (
        <div>
            <div className="LogTop">
                <h1><Link to="/">1234</Link></h1>
                <form className="LogTop" onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="email을 입력해주세요"
                        className="logMe"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        className="logMe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="logBtn">전송</button>
                </form>
            </div>
        </div>
    );
}