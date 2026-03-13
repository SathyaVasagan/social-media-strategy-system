import API from "./api";

export const getCalendarEntries = async (brandId) => {
  const res = await API.get(`/calendar/${brandId}`);
  return res.data;
};

export const createCalendarEntry = async (data) => {
  const res = await API.post("/calendar", data);
  return res.data;
};

export const updateCalendarEntry = async (id, data) => {
  const res = await API.put(`/calendar/${id}`, data);
  return res.data;
};

export const deleteCalendarEntry = async (id) => {
  const res = await API.delete(`/calendar/${id}`);
  return res.data;
};
