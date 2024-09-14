import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isEditingState, modalActivceState } from '../recoil/channel';
import { userState } from '../recoil/user';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../utils';

const Videoedit = ({ selectedVideo, setVideos }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const setActive = useSetRecoilState(modalActivceState);
  const isSetEditing = useSetRecoilState(isEditingState);
  const [title, setTitle] = useState(selectedVideo.title);
  const [description, setDescription] = useState(selectedVideo.description);
  const [isPublic, setIsPublic] = useState(selectedVideo?.isPublic);
  const [thumbnailUrl, setThumbnailUrl] = useState(selectedVideo.thumbnailUrl);

  if (!selectedVideo) {
    return null;
  }
//console.log(selectedVideo)
const Edit = async () => {
  await fetch(`http://localhost:8123/api/v1/video/${selectedVideo.videoId}`, {
    body: JSON.stringify({ title, description, isTemp: selectedVideo.isTemp }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: "PATCH"
  });

  const data = await fetch(`http://localhost:8123/api/v1/video?userId=${user.userId}`);
  const newData = await data.json();
  setVideos(newData);
};

const lastEdit = async () => {
  await fetch(`http://localhost:8123/api/v1/video/${selectedVideo.videoId}`, {
    body: JSON.stringify({ title, description, isPublic, isTemp: false }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: "PATCH"
  });

  const data = await fetch(`http://localhost:8123/api/v1/video?userId=${user.userId}`);
  const newData = await data.json();
  setVideos(newData);
};
const patchImage = async (e) => {
  try {
    const formData = new FormData();
    formData.append("thumbnailFile", e.target.files[0]);

    await fetch(`${backend_url}/api/v1/video/${selectedVideo.videoId}/newThumbnail`, {
      body: formData,
      method: "PATCH"
    });

    // 썸네일 업데이트 후 선택된 비디오 정보 다시 가져오기
    const response = await fetch(`/api/v1/video/${selectedVideo.videoId}`);
    const updatedVideo = await response.json();
    console.log(updatedVideo); // 선택된 비디오 정보 업데이트
    setThumbnailUrl(updatedVideo.thumbnailUrl);

    // 나머지 작업 수행...
  } catch (error) {
    console.error('비디오 썸네일을 업데이트하는 중 오류 발생:', error);
  }
};

  return (
    
    <div id="modal-wrap">
    <div id="modal-box">
    <div style={{ height: "900px" }}>
      <div className='modalTop'>
        <span>편집</span>
        <label className='myButton' onClick={() => { setActive(false); isSetEditing(false); Edit() }}>X</label>
      </div>

      <div className='editModal'>
        <label>
          <div className='titleEdit'>
            <p>제목(필수 항목)</p>
            <input type='text' className='titleMake' autoFocus maxLength={30} spellCheck={false} defaultValue={selectedVideo.title} onChange={(e) => { setTitle(e.target.value) }}  onKeyDown={(e) => {  if (e.key === 'Enter') 
            { e.preventDefault(); const textarea = document.querySelector('.desMake');
        textarea.focus();
      }
    }}/>
          </div>
        </label>
        <video src={selectedVideo.videoUrl} className='exVideo' poster={thumbnailUrl} controls />
        <label>
          <div className='desEdit'>
            <p>설명</p>
            <p>{selectedVideo.duration}</p>
            <textarea className='desMake' onChange={(e) => { setDescription(e.target.value) }} defaultValue={selectedVideo.description} spellCheck={false}    onKeyDown={(e) => { if (e.key === 'Backspace' && e.target.value === '') {
        e.preventDefault(); const input = document.querySelector('.titleMake'); input.focus(); }}} />
          </div>
        </label>
        <span className='radioBox'>
          <label className='choose'> <input type="radio" id="chk" name="name1" checked={isPublic} value={isPublic} onChange={(e) => { setIsPublic(true) }} /> <i className="circle"></i><span>공개</span> </label>
          <label className='choose'> <input type="radio" id="chk" name="name1" checked={!isPublic} value={!isPublic} onChange={(e) => { setIsPublic(false) }} /> <i className="circle"></i><span>비공개</span> </label>
        </span>
        <label className='thumbChange'>썸네일 <label htmlFor='thumb' className='thumbBtn'>클릭</label><input type='file' id='thumb' onChange={patchImage} accept="image/*" /></label>
        <label className='submitEditBtn' onClick={() => {     if (!title.trim()) { alert("제목을 입력하세요.");return; }
 Edit(); isSetEditing(false); setActive(false); lastEdit() }}>저장</label>
      </div>
    </div>
             </div>

             <label id="modal-bg"  onClick={()=> {setActive(false); isSetEditing(false);Edit()}}  />
           </div>
  );
};

export default Videoedit;
