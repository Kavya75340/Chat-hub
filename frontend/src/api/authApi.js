import API from "./axios";

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  // 🔥 FIX START
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data));
  // 🔥 FIX END

  return res.data;
};

export const registerUser = async (data) => {
  return API.post("/auth/register", data);
};