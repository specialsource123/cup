import React, { useEffect, useState } from 'react';
import Editheader from '../layouts/Editheader';
import { useNavigate, useParams } from 'react-router-dom';
import { backend_url } from '../utils';

const VideoEditor = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { getDate() }, []);
  
  const getDate = async () => {
    try {
      const response = await fetch(`/api/v1/video/${params.id}`, {
        method: "GET",
      });
      const data = await response.json();
      setData(data);
      setTitle(data.title || ''); // title 상태 초기화
      setDescription(data.description || ''); // description 상태 초기화
    } catch (error) {
      console.error('비디오 정보를 가져오는 중 오류 발생:', error);
    }
  }

  const patchData = async () => {
    try {
      await fetch(`/api/v1/video/${data.videoId}`, {
        body: JSON.stringify({ title, description }), // 수정된 데이터 전송
        headers: {
          'Content-Type': 'application/json'
        },
        method: "PATCH"
      });
      navigate(`/studio/channel/${data.userid}`);
    } catch (error) {
      console.error('비디오 정보를 업데이트하는 중 오류 발생:', error);
    }
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <Editheader />
      <label className='EditorBox'>
        <div className='titleEdit'>
          <p>제목(필수 항목)</p>
          <input type='text' className='titleMake' autoFocus maxLength={30} spellCheck={false} value={title} onChange={(e) => { setTitle(e.target.value) }} />
        </div>
      </label>
      <video src={data.videoUrl} className='exVideo' poster={data.thumbnailUrl} controls />
      <label>
        <div className='desEdit'>
          <p>설명</p>
          <textarea className='desMake' spellCheck={false} placeholder="123212312" value={description} onChange={(e) => { setDescription(e.target.value) }} />
        </div>
      </label>
      <label className='submitEditBtn' onClick={patchData}>저장</label>
    </div>
  );
};

export default VideoEditor;
