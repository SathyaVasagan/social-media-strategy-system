import API from "./api";

export const getBacklinks = async (brandId) => {
  const res = await API.get(`/backlinks/brand/${brandId}`);
  return res.data;
};

export const getBacklink = async (id) => {
  const res = await API.get(`/backlinks/${id}`);
  return res.data;
};

export const createBacklink = async (data) => {
  const res = await API.post("/backlinks", data);
  return res.data;
};

export const updateBacklink = async (id, data) => {
  const res = await API.put(`/backlinks/${id}`, data);
  return res.data;
};

export const deleteBacklink = async (id) => {
  const res = await API.delete(`/backlinks/${id}`);
  return res.data;
};
