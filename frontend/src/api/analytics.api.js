import axiosInstance from '../utils/axiosInstance'

export const getDashboardAnalytics = async (range = '7d') => {
  const res = await axiosInstance.get(`/analytics/dashboard?range=${range}`)
  console.log("res.data", res.data);
  return res.data
}