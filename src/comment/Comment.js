import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/user';

const Comment = () => {
    const [videos, setVideos] = useState([]);
    const [user] = useRecoilState(userState);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const videoId = 1;

    // 비디오 전체 가져오기
    useEffect(() => {
        const fetchData = async () => {
            if (user && user.userId) {
                try {
                    const response = await fetch(`http://localhost:8123/api/v1/video?userId=${user.userId}`);
                    const data = await response.json();
                    setVideos(data);
                    console.log(data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [user]);

    // 댓글 가져오기
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:8123/api/articles/${videoId}/comments`);
            if (!response.ok) throw new Error('댓글 조회 실패');
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [videoId]);

    // 댓글 추가
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user || !user.userId) {
            console.error('사용자가 로그인되지 않았습니다.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8123/api/articles/${videoId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment: newComment,
                    user: user.userId // 또는 필요한 다른 사용자 정보
                }),
            });
            if (!response.ok) throw new Error('댓글 추가 실패');
            setNewComment('');
            fetchComments(); // 댓글 추가 후 댓글 목록을 새로고침
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // 댓글 수정
    const handleEditComment = async (e) => {
        e.preventDefault();
        if (!editingComment) return;
        try {
            const response = await fetch(`http://localhost:8123/api/articles/${videoId}/comments/${editingComment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment: newComment,
                }),
            });
            if (!response.ok) throw new Error('댓글 수정 실패');
            setEditingComment(null);
            setNewComment('');
            fetchComments(); // 댓글 수정 후 댓글 목록을 새로고침
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8123/api/articles/${videoId}/comments/${commentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('댓글 삭제 실패');
            fetchComments(); // 댓글 삭제 후 댓글 목록을 새로고침
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div>
            <h1>Video Details</h1>
            <form onSubmit={editingComment ? handleEditComment : handleAddComment}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    required
                />
                <button type="submit">
                    {editingComment ? 'Update Comment' : 'Add Comment'}
                </button>
            </form>
            <div>
                {comments.map(comment => (
                    <div key={comment.id}>
                        <p>{comment.comment}</p>
                        <p>{comment.nickname} | {new Date(comment.createdAt).toLocaleString()}</p>
                        <button onClick={() => {
                            setEditingComment(comment);
                            setNewComment(comment.comment);
                        }}>
                            Edit
                        </button>
                        <button onClick={() => handleDeleteComment(comment.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comment;