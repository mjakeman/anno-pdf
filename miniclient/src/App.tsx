import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import socketio, {Socket} from 'socket.io-client'
import {generateUsername} from "unique-username-generator";

const server = "http://localhost:8080"

function App() {
  const [count, setCount] = useState(0);
  const socketRef = useRef<Socket|null>();

  useEffect(() => {
      const socket = socketio(server);
      socketRef.current = socket;

      const username = generateUsername("-");
      socketRef.current!.emit("set-username", username);

      return () => {
          socket.disconnect();
      }
  }, []);

  useEffect(() => {
      socketRef.current!.emit("count-changed", count);
  }, [count]);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
            setCount((count) => count + 1);
        }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
