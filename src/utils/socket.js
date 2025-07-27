// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://dwebx-webapi-production-73b4.up.railway.app", {
  autoConnect: false, // So you control when it connects
});

export default socket;
