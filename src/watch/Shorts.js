import React, { useEffect } from 'react'
import {useRef, useState} from "react";
import styles from './Shorts.module.css';
import ReactPlayer from 'react-player';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/user';



const Shorts = () => {
  const [comment, setComment] = useState('');
  const [response, setResponse] = useState('');
  const [comments, setComments] = useState([]);
  const [user] = useRecoilState(userState);

  const userId = user.userId;
  const picture = user.picture;

  useEffect(() => {
    fetchComments(); // 컴포넌트가 처음 로드될 때 댓글 목록을 불러옵니다.
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 서버로 댓글 제출
      const res = await fetch(`http://localhost:8123/comments?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: comment }), // 서버에서 필요한 필드명으로 수정
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setResponse('Comment received'); // 서버 응답 메시지 업데이트
      setComment(''); // 입력된 댓글 초기화

      // 댓글 목록을 서버에서 새로 받아옵니다.
      fetchComments();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchComments = async () => {
    try {
      // 서버에서 댓글 목록을 가져옵니다.
      const res = await fetch(`http://localhost:8123/comments`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      setComments(data); // 서버에서 받아온 댓글 목록을 업데이트합니다.
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          rows="4"
          cols="50"
        />
        <button type="submit">제출</button>
      </form>
      {picture && <img src={picture} alt="사용자" style={{ width: '100px', height: '100px' }} />}
      {response && <p>서버 응답: {response}</p>}

      <h3>댓글 목록</h3>
      <ul>
        {comments.map((item, index) => (
          <li key={index}>{item.text}</li> 
        ))}
      </ul>
    </div>
  );
};

export default Shorts;