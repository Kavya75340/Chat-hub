import API from "./axios";

export const createGroup = (data) => {

return API.post("/group", data);

};

export const getGroup = (groupId) => {

return API.get(`/group/${groupId}`);

};

export const addMember = (data) => {

return API.post("/group/add", data);

};

export const removeMember = (data) => {

return API.post("/group/remove", data);

};