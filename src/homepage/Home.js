import React, { useEffect, useState, useRef } from 'react';
import Layout from '../layouts/Layout';
import { userState } from '../recoil/user';
import { useRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import { backend_url } from '../utils';
import styles from './Home.module.css';


const Home = () => {
  const [user] = useRecoilState(userState);
  const [videos, setVideos] = useState([]);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [videoStates, setVideoStates] = useState({});
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.userId) {
        try {
          const response = await fetch(`http://localhost:8123/api/v1/video/all`);
          const data = await response.json();
          console.log(data);
          setVideos(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [user]);

  const handleSliderChange = (videoId, e) => {
    const newTime = (e.target.value / 100) * (videoStates[videoId]?.duration || 0);
    setVideoStates((prevStates) => ({
      ...prevStates,
      [videoId]: {
        ...prevStates[videoId],
        currentTime: newTime
      }
    }));
    if (videoRefs.current[videoId]) {
      videoRefs.current[videoId].currentTime = newTime;
    }
  };

  const handleVideoLoadedMetadata = (videoId) => {
    if (videoRefs.current[videoId]) {
      setVideoStates((prevStates) => ({
        ...prevStates,
        [videoId]: {
          ...prevStates[videoId],
          duration: videoRefs.current[videoId].duration,
          currentTime: videoRefs.current[videoId].currentTime
        }
      }));
    }
  };

  const handleTimeUpdate = (videoId) => {
    if (videoRefs.current[videoId]) {
      setVideoStates((prevStates) => ({
        ...prevStates,
        [videoId]: {
          ...prevStates[videoId],
          currentTime: videoRefs.current[videoId].currentTime
        }
      }));
    }
  };

  const handleSliderClick = (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
  };

  const handleVideoClick = (videoId) => {
    // 비디오를 클릭했을 때 링크로 이동
    window.location.href = `/watch?videoId=${videoId}`;
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Layout>
    <p>반갑습니다! {user && `안녕하세요 ${user.name} 님`}</p>
    {videos.map((video) => (
      <div
        className={styles.videoContainer}
         >
        <div className={styles.thumbnailWrapper}    key={video.videoId}
        onMouseEnter={() => setHoveredVideoId(video.videoId)}
        onMouseLeave={() => setHoveredVideoId(null)}
        onClick={() => handleVideoClick(video.videoId)} >
          <p>{video.duration}</p>
          <Link to={`/watch?videoId=${video.videoId}`} className={styles.linkWrapper}>
            <img
              src={video.thumbnailUrl}
              className={styles.thumbnail}
              alt="Thumbnail"
            />
          </Link>
          {hoveredVideoId === video.videoId && (
            <div className={styles.previewWrapper}>
              <video
                src={video.videoUrl}
                className={styles.previewVideo}
                muted
                preload="metadata"
                autoPlay
                ref={(el) => (videoRefs.current[video.videoId] = el)}
                onLoadedMetadata={() => handleVideoLoadedMetadata(video.videoId)}
                onTimeUpdate={() => handleTimeUpdate(video.videoId)}
              />
           <p className={styles.durationCover}>{video.duration}</p>
              <div className={styles.sliderContainer}>
                <div
                  className={styles.sliderBlock}
                  onClick={handleSliderClick} // 슬라이더 클릭 시 링크 클릭 방지
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(videoStates[video.videoId]?.currentTime / (videoStates[video.videoId]?.duration || 1)) * 100 || 0}
                    className={styles.slider}
                    onChange={(e) => handleSliderChange(video.videoId, e)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <p
          className={styles.videoTitle}
          onClick={(e) => {
            handleVideoClick(video.videoId);
          }}
        >
          {video.title}
        </p>
      </div>
    ))}
  </Layout>
  );
};

export default Home;
