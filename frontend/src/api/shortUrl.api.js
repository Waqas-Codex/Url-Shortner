import axiosInstance from "../utils/axiosInstance.js";

export const createShortUrl = async (url, customSlug = "") => {
  const payload = { url, customSlug };
  const { data } = await axiosInstance.post("/create", payload);
  return data;
};

export const getUserUrls = async () => {
  const { data } = await axiosInstance.get("/urls");
  return data;
};


// shortUrl.api.js
export const deleteUrl = async (id) => {
  const res = await axiosInstance.delete(`/url/${id}`)
  return res.data
}

// Qr code api
export const getQrCode = async (slug) => {
  const res = await axiosInstance.get(`/qr/${slug}`);
  return res.data;
};