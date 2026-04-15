import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const loginUser = async (data) => {

    const res = await axios.post(`${API}/login`, data);

    return res.data;   // IMPORTANT
};

export const registerUser = async (data) => {

    const res = await axios.post(`${API}/register`, data);

    return res.data;
};