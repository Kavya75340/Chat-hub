import API from "./axios";

export const createNotification = (data) => {

return API.post("/notification", data);

};

export const getUserNotifications = (userId) => {

return API.get(`/notification/${userId}`);

};

export const markAsSeen = (id) => {

return API.put(`/notification/seen/${id}`);

};

export const getUnreadCount = (userId) => {

return API.get(`/notification/unread/${userId}`);

};