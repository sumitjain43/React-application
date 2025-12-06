import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, addPost, updatePost, deletePost } from '../features/posts/postsSlice';

const Dashboard = () => {
  const { posts, loading, error } = useSelector(state => state.posts);
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', body: '' });

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleAdd = () => {
    const newPost = { id: Date.now(), ...formData };
    dispatch(addPost(newPost));
    setFormData({ title: '', body: '' });
    setIsAdding(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({ title: post.title, body: post.body });
  };

  const handleUpdate = () => {
    dispatch(updatePost({ ...editingPost, ...formData }));
    setEditingPost(null);
    setFormData({ title: '', body: '' });
  };

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Posts Dashboard</h1>
      <button onClick={() => setIsAdding(true)}>Add Post</button>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
              <td>
                <button onClick={() => handleEdit(post)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(isAdding || editingPost) && (
        <div>
          <h2>{isAdding ? 'Add Post' : 'Edit Post'}</h2>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
          <button onClick={isAdding ? handleAdd : handleUpdate}>{isAdding ? 'Add' : 'Update'}</button>
          <button onClick={() => { setIsAdding(false); setEditingPost(null); setFormData({ title: '', body: '' }); }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;