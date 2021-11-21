import React from 'react';

import { MessagesProvider } from './context/Messages';

import { Chat } from './components/chat';

function App() {
  return (
    <MessagesProvider>
      <Chat />
    </MessagesProvider>
  );
}

export default App;
