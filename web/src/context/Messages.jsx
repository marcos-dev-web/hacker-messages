import React, { useState, useContext, createContext } from 'react';

const initial_context = {
    messages: [],
    contacts: [],
    to: null,
    setTo: (to = "") => to,
    newMessage: (text = "") => text,
};

const MessagesContext = createContext(initial_context);

export function MessagesProvider({ children }) {
    const [to, setTo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [contacts] = useState(initial_context.contacts);

    function newMessage(text = "") {
        if (to) {
            const date = new Date();
            const hour = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
    
            const message = {
                hour: `${hour}:${minutes}`,
                user: null,
                id: new Date(),
                text,
            }
    
            setMessages(state => ([
                ...state,
                message
            ]));
            return true;
        }
        return false;
    }

    return (
        <MessagesContext.Provider value={{ messages, newMessage, setTo, to, contacts }}>
            {children}
        </MessagesContext.Provider>
    );
}

export function useMessages() {
    return useContext(MessagesContext);
}
