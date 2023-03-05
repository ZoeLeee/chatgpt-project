import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

const host = location.href.includes("localhost") ? "http://localhost:3000" : "http://chatgpt.dodream.cn:3000";

let doing = false;

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

function App() {
  const [messages, setMessages] = useState<{ id: string, msg: string; }[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const handleKeydown = async () => {
    if (!msg) return;
    setMessages(messages => [...messages, { id: Date.now().toString(), msg }]);

    postData(host + "/api/chatgpt", { message: msg }).then(response => {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let msg = "";
      let id = Date.now().toString();
      function read() {
        reader.read().then(({ value, done }) => {
          console.log('done: ', done);
          if (done) {
            console.log('Stream is closed');
            return;
          }

          msg = decoder.decode(value);
          setMessages(messages => {
            const m = messages.find(msg => msg.id === id);
            if (m) {
              m.msg = msg;
            } else {
              messages.push({
                msg, id
              });
            }
            return [...messages];
          });
          read();
        });
      }

      read();
    });


    setMsg("");
  };

  return (
    <div className="App">
      <div className='content' style={{ padding: 10 }}>
        {
          messages.map(msg => <pre key={msg.id} style={{ padding: 5 }}>
            <code style={{
              display: "block",
              whiteSpace: "break-spaces"
            }}>
              {
                msg.msg
              }
            </code>
          </pre>)
        }
      </div>
      <div className='input'>
        <input disabled={loading} value={msg} onChange={(e) => setMsg(e.target.value)}
          onCompositionStart={() => { doing = true; }}
          onCompositionEnd={() => { doing = false; }}
          onKeyDown={e => {
            if (e.code === "Enter" && !doing) {
              handleKeydown();
            }
          }} />
        <button onClick={handleKeydown}>发送</button>
      </div>
      <div style={{ position: "fixed", right: 10, top: 10 }}>
        <a href="https://github.com/ZoeLeee/chatgpt-project.git">GitHub</a>
      </div>
    </div>
  );
}

export default App;
