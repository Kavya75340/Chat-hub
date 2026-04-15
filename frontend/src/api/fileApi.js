import API from "./axios";

export const uploadFile = (file, chatId, senderId) => {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("chatId", chatId);
    formData.append("senderId", senderId);

    return API.post(
        "/file/upload",
        formData,
        {
            headers:{
                "Content-Type":
                "multipart/form-data"
            }
        }
    );

};

export const getFiles = (chatId) => {

return API.get(`/file/${chatId}`);

};