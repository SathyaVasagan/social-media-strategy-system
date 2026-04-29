import API from "./api";

/* GET */

export const getPosts = async (brandId) => {
  const res = await API.get(`/posts/brand/${brandId}`);
  return res.data;
};

export const getPost = async (id) => {
  const res = await API.get(`/posts/${id}`);
  return res.data;
};

/* CREATE */

export const createPost = async (formData) => {
  const res = await API.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/* 🔥 UPDATE POST */
export const updatePost = async (id, data) => {
  const res = await API.put(`/posts/${id}`, data);
  return res.data;
};

/* 🚀 TOGGLE STATUS (NEW) */
export const togglePostStatus = async (id) => {
  const res = await API.patch(`/posts/${id}/toggle-status`);
  return res.data;
};

/* DELETE */

export const deletePost = async (id) => {
  const res = await API.delete(`/posts/${id}`);
  return res.data;
};

/* 🔥 RETRY POST */

export const retryPost = async (id) => {
  const res = await API.post(`/posts/${id}/retry`);
  return res.data;
};

/* 🔥 RESCHEDULE POST */

export const reschedulePost = async (id, data) => {
  const res = await API.put(`/posts/${id}/reschedule`, data);
  return res.data;
};
