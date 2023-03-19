import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

const host = location.href.includes("localhost") ? "http://localhost:3000" : "https://www.dodream.cn/chatgptproxy";

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
  return response.json(); // parses JSON response into native JavaScript objects
}

function App() {
  const [messages, setMessages] = useState<{ id: string, msg: string; }[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const handleKeydown = async () => {
    if (!msg) return;
    setMessages(messages => [...messages, { id: Date.now().toString(), msg }]);
    setLoading(true);
    const result = await postData(host + "/api/chatgpt", { message: msg }) as any;
    console.log('result: ', result);
    setLoading(false);
    setMsg("");
    console.log('result.text: ', result.text);
    setMessages(messages => [...messages, { id: Date.now().toString(), msg: result.text }]);
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
        {loading && <div>正在生成回复</div>}
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
