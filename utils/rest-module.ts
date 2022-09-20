import axios from "axios";

export default () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
  });
};
