import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const login = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      credentials: "include", // для передачи refreshToken из cookie
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Ошибка входа");

    const data = await response.json();

    // Сохраняем accessToken в localStorage
    localStorage.setItem("accessToken", data.accessToken);

    if (data.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/catalog");
    }
  } catch (err) {
    setError("Неверный логин или пароль");
  }
};



  return (
    <div className="container mt-5">
      <h2>Вход администратора</h2>
      <input type="text" placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Войти</button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};



export default LoginPage;

