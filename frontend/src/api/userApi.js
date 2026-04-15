import API from "./axios";

export const searchUsers = (keyword) => {

return API.get(`/users/search?keyword=${keyword}`);

};

export const getCurrentUser = () => {

return API.get("/users/me");

};

export const updateUserStatus = (id, online) => {

return API.put(`/users/${id}/online?online=${online}`);

};