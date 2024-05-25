import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RecipDetail.css";

const Comments = ({ recipeId, userName, isProfile }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const endpoint = isProfile
          ? '/api/profile/comments'
          : `/api/recipe/${recipeId}/comments`;
        console.log(endpoint);
        const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        setComments(data || []);
      } catch (error) {
        console.error('erreur:', error);
      }
    };

    fetchComments();
  }, [recipeId, isProfile]);

  const CommentSubmit = async (e) => {
    e.preventDefault();
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;

    try {
      const response = await fetch(`/api/recipe/${recipeId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipeId, userName, comment: newComment })
      });
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]); 
        setNewComment(''); 
    } catch (error) {
      console.error('erreur:', error);
    }
  };

  const DeleteComment = async (e,commentId) => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    e.stopPropagation();
    e.preventDefault();
    try {
      const endpoint = isProfile
        ? `/api/profile/comment/${commentId}`
        : `/api/recipe/${recipeId}/comment/${commentId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
        setComments(comments.filter(comment => comment.id !== commentId));

    } catch (error) {
      console.error('erreur:', error);
    }
  };

  return (
    <div className='comments-section'>
      <h2>{isProfile ? 'Mes Commentaires' : 'Commentaires'}</h2>
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Link to={`/recipe/${comment.RecipeId}`} key={index} className="comment-link">
              <div className="comment">
                <div className="comment-header">
                  <strong>{comment.UserName}</strong>
                  {comment.UserName === userName && (
                    <button onClick={(e) => DeleteComment(e,comment.id)}>Supprimer</button>
                  )}
                </div>
                <p>{comment.Comment}</p>
                <small>{new Date(comment.CreatedAt).toLocaleString()}</small>
              </div>
            </Link>
          ))
        ) : (
          <p>Pas de commentaires ici, soyez le premier à laisser un commentaire !</p>
        )}
      </div>

      {!isProfile && (
        <form className="comment-form" onSubmit={CommentSubmit}>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ecrire un commentaire"
            required
          />
          <button type="submit">Poster Commentaire</button>
        </form>
      )}
    </div>
  );
};

export default Comments;
