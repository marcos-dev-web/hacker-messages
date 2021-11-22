import React, { useState, useRef } from 'react';

import { useMessages } from '../../context/Messages';

import { getCommand } from '../../utils/getCommand';

import styles from './styles.module.css';

export const Chat = () => {
  const { messages, newMessage, to, updateTo, contacts, clearMessages } = useMessages();

  const [text, setText] = useState('');

  const down = useRef();

  const commands = {
    'clear': () => {
      clearMessages();

      return true;
    },
    'set_id': args => {
      const result = updateTo(args[0]);
      if (result) {
        alert(`You select id: ${args[0]}`);
        return true;
      }

      alert(`${args[0]} is not a contact`);
      return false;
    },
  }

  function submit() {
    const [command, args] = getCommand(text);

    if (command) {
      const result = commands?.[command]?.(args);

      if (result) {
        setText('');
        down.current.scrollIntoView(true);
      }
    } else {
      const result = newMessage(text);
      if (result) {
        setText('');
        down.current.scrollIntoView(true);
      }
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.messages}>
          <ul>
            <div>
              {!to ? (
                <p>
                  <span>!set_id user_id;</span> // to sent message
                </p>
              ) : (
                <p>
                  {to}
                </p>
              )}
            </div>
            {
              messages.map(message => (
                <li key={message.id} className={styles.li}>
                  <span className={!message.user ? styles.me : undefined}><span>@</span>{message.user || "me"}<span>:</span></span>
                  <p>{message.text}</p>
                  <span>
                    {message.hour}
                  </span>
                </li>
              ))
            }
            <span ref={down} className={styles.bottom} />
          </ul>
          <input
            className={styles.input}
            type="text"
            placeholder="type..."
            value={text}
            onChange={e => setText(String(e.target.value))}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                submit();
              }
            }}
          />
        </div>
        <ul className={styles.contacts}>
          <h1>Users</h1>
          {contacts.map(contact => (
            <li key={contact}>user<span>@</span>{contact}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
