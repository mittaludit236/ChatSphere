import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function CommentModal({ postId, closeModal }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const fetchComments = async () => {
        try {
            const response = await axios.get('/posts/comments', {
                params: { postId: postId }
            });
            const commentsWithUsernames = await Promise.all(response.data.map(async (comment) => {
                const userResponse = await axios.get('/users', {
                    params: { userId: comment.userId }
                });
                const username = userResponse.data.username;
                return { ...comment, username };
            }));
            setComments(commentsWithUsernames);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmitComment = async () => {
        try {
            await axios.post(`/posts/comments`, {
                userId: user._id,
                postId: postId,
                description: newComment
            });
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
                    <ul className="space-y-4">
                        {comments.map((comment) => (
                            <li key={comment._id} className="border p-3 rounded-md shadow-md flex items-center">
                                <div className="flex items-center w-full">
                                    <div className="mr-4">
                                        <img
                                            className="w-8 h-8 rounded-full object-cover"
                                            src={
                                                user?.profilePicture
                                                    ? PF + user.profilePicture
                                                    : PF + "person/noadmin.webp"
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold mb-1">
                                            <Link to={`/profile/${comment.username}`}>{comment.username}</Link>
                                        </span>
                                        <span>{comment.description}</span>
                                    </div>
                                </div>
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
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-60"
                        onClick={handleSubmitComment}
                    >
                        Send
                    </button>
                </div>
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={closeModal}
                >
                    <AiOutlineClose />
                </button>
            </div>
        </div >
    );
}
