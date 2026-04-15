import API from "./axios";

export const sendMessage = (data) => {

return API.post("/message", data);

};

export const getMessages = (chatId) => {

return API.get(`/message/${chatId}`);

};