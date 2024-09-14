import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

// 전역 stompClient 변수
let stompClient = null;

export const Stream = () => {
  const [privateChats, setPrivateChats] = useState(new Map());     
  const [publicChats, setPublicChats] = useState([]); 
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: '',
    receivername: '',
    connected: false,
    message: ''
  });

  // 로컬 스토리지에서 채팅 데이터를 로드하는 함수
  const loadChatsFromLocalStorage = () => {
    const savedPublicChats = localStorage.getItem('publicChats');
    const savedPrivateChats = localStorage.getItem('privateChats');

    if (savedPublicChats) {
      setPublicChats(JSON.parse(savedPublicChats));
    }

    if (savedPrivateChats) {
      setPrivateChats(new Map(JSON.parse(savedPrivateChats)));
    }
  };

  // 로컬 스토리지에 채팅 데이터를 저장하는 함수
  const saveChatsToLocalStorage = () => {
    localStorage.setItem('publicChats', JSON.stringify(publicChats));
    localStorage.setItem('privateChats', JSON.stringify(Array.from(privateChats.entries())));
  };

  // 연결 함수
  const connect = () => {
    let Sock = new SockJS("http://localhost:8123/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  // 연결 후 호출되는 함수
  const onConnected = () => {
    setUserData(prev => ({ ...prev, connected: true }));
    stompClient.subscribe('/chatroom/public', onMessageReceived);
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN"
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    setPublicChats(prevChats => {
      const updatedChats = [...prevChats, payloadData];
      saveChatsToLocalStorage(); // 로컬 스토리지에 저장
      return updatedChats;
    });
  };


  const onError = (err) => {
    console.error('Error:', err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData(prev => ({ ...prev, message: value }));
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE"
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData(prev => ({ ...prev, message: '' }));
    }
  };



  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData(prev => ({ ...prev, username: value }));
  };

  const registerUser = () => {
    connect();
  };

  useEffect(() => {
    loadChatsFromLocalStorage(); // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  }, []);

  useEffect(() => {
    // cleanup function to disconnect the WebSocket connection
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log('Disconnected');
        });
      }
    };
  }, []);

  return (
    <div className="container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li onClick={() => setTab("CHATROOM")} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
              {[...privateChats.keys()].map((name, index) => (
                <li onClick={() => setTab(name)} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
              ))}
            </ul>
          </div>
          {tab === "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                  </li>
                ))}
              </ul>
              <div className="send-message">
                <input type="text" className="input-message" placeholder="Enter the message" value={userData.message} onChange={handleMessage} /> 
                <button type="button" className="send-button" onClick={sendValue}>Send</button>
              </div>
            </div>
          )}
          {tab !== "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                  </li>
                ))}
              </ul>
              <div className="send-message">
                <input type="text" className="input-message" placeholder="Enter the message" value={userData.message} onChange={handleMessage} /> 
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            margin="normal"
          />
          <button type="button" onClick={registerUser}>
            Connect
          </button> 
        </div>
      )}
    </div>
  );
};

export default Stream;