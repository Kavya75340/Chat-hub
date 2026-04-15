import SockJS from "sockjs-client";

import Stomp from "stompjs";

export const connectSocket = onMessage => {

const socket = new SockJS(

"http://localhost:8080/ws"
);

const stomp = Stomp.over(socket);

stomp.connect({},()=>{

stomp.subscribe(

"/topic/messages",

msg=>{

onMessage(

JSON.parse(msg.body)
);

}
);

});

return stomp;

};