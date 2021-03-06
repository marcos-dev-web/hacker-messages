import React, { useState, useContext, createContext, useEffect } from "react";

import io from "socket.io-client";

const initial_context = {
  messages: [],
  contacts: [],
  to: null,
  updateTo: (to = "") => to,
  newMessage: (text = "") => text,
  clearMessages: () => {},
  updateName: (name) => name,
};

const MessagesContext = createContext(initial_context);

export function MessagesProvider({ children }) {
  const [to, setTo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState(initial_context.contacts);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("http://localhost:8000", { transports: ["websocket"] });
    setSocket(s);
    s.on("users/all", (data) => {
      if (data) {
        const ctts = data.filter((c) => c.id !== s.id);
        setContacts(ctts);
      }
    });

    s.on("message", (data) => {
      const date = new Date();

      const hour = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      console.log(contacts);
      console.log(data);
      setMessages((state) => [
        ...state,
        {
          id: new Date(),
          user: data.from,
          text: data.message,
          hour: `${hour}:${minutes}`,
        },
      ]);
    });

    return () => {
      setTo(null);
      setContacts([]);
      setMessages([]);
      s.disconnect();
    };
  }, []);

  function updateName(name = "") {
    socket.emit("change_name", name);
  }

  function updateTo(id = "") {
    if (id === null) {
      setTo(null);
      return true;
    }

    if (contacts.find((c) => c.id === id.replace(/[\d\s\w]+@/, ""))) {
      setTo(id.replace(/[\d\s\w]+@/, ""));
      return true;
    }
    return false;
  }

  function clearMessages() {
    setMessages([]);
  }

  function newMessage(text = "", info = false) {
    if (!text.trim().length) {
      return false;
    }
    if (to && !info) {
      const payload = {
        id: socket.id,
        to,
        text,
      };

      socket.emit("message", payload);

      const date = new Date();
      const hour = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      const message = {
        hour: `${hour}:${minutes}`,
        user: null,
        id: new Date(),
        text,
      };

      setMessages((state) => [...state, message]);
      return true;
    } else if (info) {
      const date = new Date();
      const hour = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      const message = {
        hour: `${hour}:${minutes}`,
        info: true,
        id: new Date(),
        text,
      };

      setMessages((state) => [...state, message]);
      return true;
    }

    return false;
  }

  return (
    <MessagesContext.Provider
      value={{
        messages,
        newMessage,
        updateTo,
        to,
        contacts,
        clearMessages,
        updateName,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}
