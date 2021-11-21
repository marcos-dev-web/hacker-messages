import React, { useState, useRef } from 'react';

import { useMessages } from '../../context/Messages';

import styles from './styles.module.css';

export const Chat = () => {
  const { messages, newMessage, to, setTo, contacts } = useMessages();

  const [text, setText] = useState('');

  const down = useRef();

  function submit() {
    if (to && text.trim().length > 0) {
      const result = newMessage(text);
      if (result) {
        setText('');
        down.current.scrollIntoView(true);
      }
    } else {
      if (text.trim().length > 0) {
        setTo(text);
        setText('');
      }
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.messages}>
          <ul>
            {!to && (
              <div>
                <p>
                  TYPE THE USER ID THAT YOU WANTS TO SEND MESSAGES...
                </p>
              </div>
            )}
            {
              messages.map(message => (
                <li key={message.id} className={styles.li}>
                  <span className={!message.user && styles.me}><span>@</span>{message.user || "me"}<span>:</span></span>
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
            placeholder={to ? "type..." : "TYPE THE USER ID THAT YOU WANT TO SEND MESSAGES..."}
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
            <li key={contact.id}>{contact.id}<span>@</span>{contact.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
