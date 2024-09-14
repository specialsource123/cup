import React, { useEffect, useState } from 'react';

function VideoComponent({ videoId }) {
    const [hasViewed, setHasViewed] = useState(false);

    useEffect(() => {
        // LocalStorage에서 조회 여부를 확인
        const hasViewedFromStorage = localStorage.getItem(`videoViewed_${videoId}`);

        if (!hasViewedFromStorage) {
            // 3초 후에 'Hello, World!' 메시지를 출력하고 조회수 증가 요청을 보냄
            const timer = setTimeout(() => {
                console.log('Hello, World!');
                // 서버에 조회수 증가 요청을 보냄
                fetch('/increase-view-count', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ videoId }),
                });

                // LocalStorage에 조회 여부를 기록
                localStorage.setItem(`videoViewed_${videoId}`, 'true');
                setHasViewed(true);
            }, 3000); // 3초 후 실행

            // 컴포넌트가 언마운트될 때 타이머를 정리
            return () => clearTimeout(timer);
        } else {
            setHasViewed(true);
        }
    }, [videoId]);

    return <div>{hasViewed ? 'You have viewed this video' : 'Check back after 3 seconds!'}</div>;
}

export default VideoComponent;