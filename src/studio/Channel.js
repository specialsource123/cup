import React from 'react';
import Layout from '../layouts/Layout';
import VideoList from './VideoList';
import Button from '../modal/Button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../recoil/user';
import { useEffect } from 'react';
import { modalActivceState, selectedVideoState } from '../recoil/channel';
import { useState } from 'react';
import { backend_url } from '../utils';


const Channel = () => {
  const [loading, setLoading] = useState(true)
  const setActive = useSetRecoilState(modalActivceState)
  const [videos, setVideos] = useState(null);
  const [selectedVideo,setSelectedVideo ] = useRecoilState(selectedVideoState);
  const user = useRecoilValue(userState)
  console.log(selectedVideo)
  
  useEffect(()=>{
    const getGet = async () => {
      const getUser = await fetch(`http://localhost:8123/api/v1/video?userId=${user.userId}`, {
        redirect: "manual"
      });
      const data = await getUser.json(); // 응답 본문을 JSON으로 변환
      setVideos(data);
      setLoading(false);
    }
    getGet();
  }, []);
  


async function videoUpload(e){

  e.preventDefault();
  

  const formData = new FormData();
  Object.keys(e.target.files).map((key)=>
    formData.append("files", e.target.files[key]))

  
  try{
  const response = await fetch(`http://localhost:8123/api/v1/video?userId=${user.userId}`,
  {method:"POST", headers: { },body: formData, // FormData 객체를 body로 전달
  })
  e.target.value = ""
  const data = await response.json();
  console.log(data); // 서버에서 반환한 데이터 로깅
  setVideos(data)
  setActive(false)
  
  }catch(e){
  console.log("이상함")
  }}
    return (
      <Layout>
        <div className='god' >
         {loading ? <div>loading</div> :  <Button setVideos={setVideos} selectedVideo={selectedVideo} /> }
         {!loading && videos && videos.map((video, index) => (
  <VideoList key={index} video={video} setSelectedVideo={setSelectedVideo} />
))}

       <input type='file' id='modalUpload' style={{display:'none'}} accept="video/*" multiple onChange={videoUpload} />
        </div>  

      </Layout>

    );
};
export default Channel;