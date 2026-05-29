import axiosInstance from './axiosInstance';

export const createCheckoutSession = async (data) => {
  const res = await axiosInstance.post('/stripe/create-checkout-session', data);
  return res.data;
};
