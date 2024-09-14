import React, { useEffect, useState, useRef } from 'react';
import Watchheader from '../layouts/Watchheader';
import { useSearchParams } from 'react-router-dom';
import { backend_url } from '../utils';
import { userState } from '../recoil/user';
import { useRecoilState } from 'recoil';


const VideoDetail = () => {
    const [video, setVideo] = useState(null);
    const [params] = useSearchParams();
    const videoId = params.get("videoId");
    const videoRef = useRef(null);
    const [comment, setComment] = useState(''); // 초기값을 빈 문자열로 설정
    const [response, setResponse] = useState(null);
    const [comments, setComments] = useState([]);
    const [user] = useRecoilState(userState);
    const [liked, setLiked] = useState(false);
    const userId = user.userId;
    const picture = user.picture;
    const [hasViewed, setHasViewed] = useState(false);

    useEffect(() => {
        const hasViewedFromStorage = localStorage.getItem(`videoViewed_${videoId}`);

        if (!hasViewedFromStorage) {
            const timer = setTimeout(async () => {
                try {
                    await fetch(`http://localhost:8123/api/v1/setting/${videoId}/watch`, {
                        method: 'POST'
                    });
                    console.log("실행됨");
                } catch (error) {
                    console.error('Error updating view count:', error);
                }

                localStorage.setItem(`videoViewed_${videoId}`, 'true');
                setHasViewed(true);
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setHasViewed(true);
        }
    }, [videoId]);

    const handleLike = () => {
        setLiked(prevLiked => !prevLiked);
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (liked) {
                const url = `http://localhost:8123/api/v1/setting/${videoId}/likes`;
                const data = JSON.stringify({ videoId });

                navigator.sendBeacon(url, data);
                console.log('Like sent to server');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [liked, videoId]);

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch(`http://localhost:8123/comments?userId=${userId}&videoId=${videoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: comment // 수정된 부분
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            setResponse('Comment received');
            setComment('');
            fetchComments();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const fetchComments = async () => {
        try {
            const res = await fetch(`http://localhost:8123/comments?videoId=${videoId}`);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            console.log("받은 데이터:", data);
    
            setComments(data.map(comment => ({
                text: comment.text,
                picture: comment.pictureUrl || picture // 기본 사진 사용
            })));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`http://localhost:8123/api/v1/video/${videoId}`);
                const video = await response.json();
                setVideo(video);
                if (videoRef.current) {
                    videoRef.current.addEventListener('loadedmetadata', () => {
                        console.log('비디오의 재생 시간:', videoRef.current.duration);
                    });
                }
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };
        getData();
    }, [videoId]);

    if (!video) {
        return null;
    }

    return (
        <div className="videoContainer">
            <Watchheader />
            <span>
                <video
                    src={video.videoUrl}
                    autoPlay
                    controls
                    className='watchVideo'
                    ref={videoRef}
                />
            </span>
            <h2>{video.title}</h2>
            <p>{video.views}</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    rows="4"
                    cols="50"
                />
                <button type="submit">제출</button>
                {picture && <img src={picture} alt="사용자" style={{ width: '100px', height: '100px' }} />}
            </form>
            <h3>댓글 목록</h3>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={comment.picture} alt="사용자" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                        {comment.text}
                    </li>
                ))}
            </ul>
            <button onClick={handleLike}>
                {liked ? '싫어요' : '좋아요'}
            </button>
            <button onClick={handleLike}>저장</button>
        </div>
    );
};

export default VideoDetail;