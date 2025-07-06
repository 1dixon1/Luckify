import React, { useState } from 'react';
import axios from "axios";

const API = "http://localhost:5000/api";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [bet, setBet] = useState(100);
  const [message, setMessage] = useState("");

  const login = async () => {
    const res = await axios.post(`${API}/auth/login`, { username, password });
    setToken(res.data.token);
    setBalance(res.data.user.balance);
  };

  const register = async () => {
    await axios.post(`${API}/auth/register`, { username, password });
    await login();
  };

  const spin = async () => {
    const res = await axios.post(
      `${API}/game/spin`,
      { bet },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setMessage(`Result: ${res.data.result}, +${res.data.winAmount}`);
    setBalance(res.data.newBalance);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">🎰 Рулетка</h1>

      {!token ? (
        <>
          <input
            className="border p-2"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border p-2"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </button>
            <button onClick={register} className="bg-green-500 text-white px-4 py-2 rounded">
              Register
            </button>
          </div>
        </>
      ) : (
        <>
          <div>Balance: 💰 {balance}</div>
          <input
            className="border p-2 w-32"
            type="number"
            value={bet}
            onChange={(e) => setBet(+e.target.value)}
          />
          <button
            onClick={spin}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            SPIN
          </button>
          <div>{message}</div>
        </>
      )}
    </div>
  );
}
