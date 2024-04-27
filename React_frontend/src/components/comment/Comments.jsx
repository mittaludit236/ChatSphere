import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AiOutlineClose } from 'react-icons/ai';

export default function CommentModal({ postId, closeModal }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useContext(AuthContext)
    const fetchComments = async () => {
        try {
            const response = await axios.get('/posts/comments', {
                params: { postId: postId }
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmitComment = async () => {
        try {
            // Make a request to add the new comment
            await axios.post(`/posts/comments`, {
                userId: user._id,
                postId: postId,
                description: newComment
            });
            // Refresh comments after adding a new comment
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
            <div className="bg-white p-4 rounded-md w-96 relative">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment._id} className="mb-2">
                                <span className="font-semibold">{comment.userId}: </span>
                                {comment.description}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <textarea
                        className="w-full p-2 border rounded-md mb-2"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleSubmitComment}
                    >
                        Send
                    </button>
                </div>
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={closeModal}
                >
                    <AiOutlineClose/>
                </button>
            </div>
        </div >
    );
}
