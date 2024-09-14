import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/user';

const LoginSuccess = () => {
    const location = useLocation();
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userState); // Recoil 상태 사용

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userParam = params.get('user');
        const userIdParam = params.get('userId'); // userId 가져오기

        if (userParam) {
            try {
                const decodedUser = decodeURIComponent(userParam);
                const userInfo = JSON.parse(decodedUser);

                // userId 추가
                userInfo.userId = userIdParam;

                setUserInfo(userInfo);
                setUser(userInfo); // Recoil 상태 업데이트
                navigate("/");
            } catch (error) {
                console.error('Error parsing user info:', error);
            }
        }
    }, [location, setUser, navigate]);

    return (
        <div>
            <h1>Login Successful</h1>
            {userInfo ? (
                <div>
                    <p>Welcome, {userInfo.name}!</p>
                    <img src={userInfo.picture} alt="Profile" />
                    <p>Email: {userInfo.email}</p>
                    <p>User ID: {userInfo.userId}</p> {/* Display userId */}
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default LoginSuccess;
