import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const connectSocket = (chatId, onMessage) => {

  const socket = new SockJS("http://localhost:8080/ws");

  const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, 

      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
          client.subscribe(`/topic/messages/${chatId}`, (msg) => {
              try {
                  onMessage(JSON.parse(msg.body));
              } catch {
                  onMessage(msg.body);
              }
          });
      },
  });

  client.activate();

  return client;
};

export const connectStatusSocket = (onStatus) => {
    const socket = new SockJS("http://localhost:8080/ws");
  
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  
      onConnect: () => {
        client.subscribe("/topic/status", (msg) => {
          onStatus(msg.body);
        });
      },
    });
  
    client.activate();
    return client;
  };