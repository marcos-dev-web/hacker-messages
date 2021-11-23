import React, { useState, useRef } from "react";

import { useMessages } from "../../context/Messages";

import { getCommand } from "../../utils/getCommand";

import styles from "./styles.module.css";

export const Chat = () => {
  const {
    messages,
    newMessage,
    to,
    updateTo,
    contacts,
    clearMessages,
    updateName,
  } = useMessages();
  const [showCommands, setShowCommands] = useState(false);

  const [text, setText] = useState("");

  const down = useRef();

  const commands = {
    clear: () => {
      clearMessages();

      return true;
    },
    set_id: (args) => {
      const result = updateTo(args[0]);
      if (result) {
        newMessage(`You select id: ${args[0]}`, true);
        return true;
      }

      alert(`${args[0]} is not a contact`);
      return false;
    },
    disconnect_user: () => {
      updateTo(null);
      return true;
    },
    set_name: (args) => {
      updateName(args[0]);

      return true;
    },
    commands: () => {
      setShowCommands(true);
      return true;
    },
  };

  const listCommands = [
    {
      name: "clear",
      args: [],
    },
    {
      name: "commands",
      args: [],
    },
    {
      name: "disconnect_user",
      args: [],
    },
    {
      name: "set_id",
      args: ["user@user_id"],
    },
    {
      name: "set_name",
      args: ["your_user_name"],
    },
  ];

  function submit() {
    const [command, args] = getCommand(text);

    if (command) {
      const result = commands?.[command]?.(args);

      if (result) {
        setText("");
        down.current.scrollIntoView(true);
      }
    } else {
      const result = newMessage(text);
      if (result) {
        setText("");
        down.current.scrollIntoView(true);
      }
    }
  }

  return (
    <main className={styles.main}>
      {showCommands && (
        <div
          className={styles.commands}
          onClick={() => {
            setShowCommands(false);
          }}
        >
          <h1>Commands</h1>
          <div>
            {listCommands.map((command, i) => (
              <p key={i}>
                !{command.name}
                {command.args.map((arg) => ` ${arg}`)};
              </p>
            ))}
          </div>
        </div>
      )}
      <div className={styles.center}>
        <div className={styles.messages}>
          <ul>
            <div>
              {!to ? (
                <p>
                  <span>!commands;</span> {"// to see all commands"}
                </p>
              ) : (
                <p>{to}</p>
              )}
            </div>
            {messages.map((message) =>
              message.info ? (
                <li key={message.id} className={styles.info}>
                  <p>{message.text}</p>
                  <span>{message.hour}</span>
                </li>
              ) : (
                <li key={message.id} className={styles.li}>
                  <span className={!message.user ? styles.me : undefined}>
                    <span className={styles.name}>
                    {contacts.find(c => c.id === message.user)?.name}
                    </span>
                    <span>@</span>
                    {message.user || "me"}
                    <span>:</span>
                  </span>
                  <p>{message.text}</p>
                  <span>{message.hour}</span>
                </li>
              )
            )}
            <span ref={down} className={styles.bottom} />
          </ul>
          <input
            className={styles.input}
            type="text"
            placeholder="type..."
            value={text}
            onChange={(e) => setText(String(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit();
              }
            }}
          />
        </div>
        <ul className={styles.contacts}>
          <h1>Users</h1>
          {contacts.map((contact) => (
            <li key={contact.id}>
              {contact.name || 'user'}<span>@</span>
              {contact.id}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};
