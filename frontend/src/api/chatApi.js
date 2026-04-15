import API from "./axios";

export const createChatRoom = (data) => {

return API.post("/chatroom", data);

};