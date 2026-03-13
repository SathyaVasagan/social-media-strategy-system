import API from "./api";

export const getAnalytics = async (brandId) => {
  const res = await API.get(`/analytics/${brandId}`);
  return res.data;
};
