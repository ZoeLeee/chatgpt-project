import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

const host = location.href.includes("localhost") ? "http://localhost:3000" : "";

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function App() {
  const [messages, setMessages] = useState<{ id: string, msg: string; }[]>([]);
  const [msg, setMsg] = useState("");

  const handleKeydown = async () => {
    if (!msg) return;
    const res = await postData(host + "/api/chatgpt", { messages: msg });
    setMessages([...messages, { id: Date.now().toString(), msg }, {
      msg: res.response,
      id: res.messageId
    }]);
    setMsg("");
  };

  return (
    <div className="App">
      <div className='content'>
        {
          messages.map(msg => <pre key={msg.id}>
            <code>
              {
                msg.msg
              }
            </code>
          </pre>)
        }
      </div>
      <div className='input'>
        <input value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button onClick={handleKeydown}>发送</button>
      </div>
    </div>
  );
}

export default App;
