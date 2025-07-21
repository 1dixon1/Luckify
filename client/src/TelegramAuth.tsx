import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: any;
  }
}

const TelegramAuth: React.FC<{ onAuth: (user: any) => void }> = ({ onAuth }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      alert("Запусти через Telegram");
      return;
    }

    const userData = tg.initDataUnsafe?.user; // данные пользователя из Telegram

    if (userData) {
      setUser(userData);
      onAuth(userData);
    } else {
      alert("Не удалось получить данные пользователя Telegram");
    }
  }, [onAuth]);

  return user ? (
    <div>
      <p>Привет, {user.first_name}!</p>
    </div>
  ) : (
    <p>Авторизация через Telegram...</p>
  );
};

export default TelegramAuth;
