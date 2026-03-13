import API from "./api";

export const getPosts = async (brandId) => {
  const res = await API.get(`/posts/brand/${brandId}`);
  return res.data;
};

export const getPost = async (id) => {
  const res = await API.get(`/posts/${id}`);
  return res.data;
};

export const createPost = async (data) => {
  const res = await API.post("/posts", data);
  return res.data;
};

export const updatePost = async (id, data) => {
  const res = await API.put(`/posts/${id}`, data);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await API.delete(`/posts/${id}`);
  return res.data;
};
