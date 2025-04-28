import React, { createContext, useEffect } from "react";
import WebSocket from "ws";

const SocketContext = createContext(null);

type Props = {
  children: React.ReactNode;
};

const SocketProvider: React.FC<Props> = ({ children }) => {
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");

        socket.on("error", ()=>{
            console.log("Error connecting to socket server");
        })

        socket.on("open", ()=>{
            console.log("connected to socket server")
        })

        socket.send(JSON.stringify({type: "code", code: "console.log(\"helloworld\")"}))

        return ()=>{
            socket.close();
        }

    }, [])
  return (
    <SocketContext.Provider value={null}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

