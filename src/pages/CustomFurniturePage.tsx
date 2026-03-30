import { useEffect, useState } from "react";
import axios from "axios";
import FurnitureCard from "../components/FurnitureCard";
import {Navbar} from "./CatalogPage"
import { Furniture, Shelves, Seats } from "../types/furniture";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ?? null;
  }
  return null;
}

const CustomFurniturePage = () => {
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


      // let token = localStorage.getItem("accessToken");

      // const response = await axios.get("http://localhost:3001/api/admin", {
      //   headers: { Authorization: `Bearer ${token}` },
      //   withCredentials: true,
      // });

  useEffect(() => {
  const fetchCustomFurniture = async () => {
    try {
      let token = getCookie("accessToken");
      if (!token) {
        // Если токена нет, пытаемся обновить через refresh
        throw new Error("unauthorized");
      }

      const response = await axios.get("http://localhost:3001/api/furniture/custom", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setFurniture(response.data);
      setLoading(false);
    } catch (error: any) {
      // Если ошибка авторизации (401) или отсутствие токена
      if (error.response?.status === 401 || error.message === "unauthorized") {
        try {
          // Обновляем токен
          const refreshResp = await axios.post(
            "http://localhost:3001/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          const newToken = refreshResp.data.accessToken;
          // Сохраняем новый токен в куку
          document.cookie = `accessToken=${newToken}; path=/; Secure; SameSite=Strict`;

          // Повторяем исходный запрос с новым токеном
          const retryResponse = await axios.get("http://localhost:3001/api/furniture/custom", {
            headers: { Authorization: `Bearer ${newToken}` },
            withCredentials: true,
          });

          setFurniture(retryResponse.data);
          setLoading(false);
        } catch (refreshError) {
          setError("Не удалось загрузить пользовательскую мебель. Пожалуйста, войдите снова.");
          setLoading(false);
        }
      } else {
        setError("Не удалось загрузить пользовательскую мебель");
        setLoading(false);
      }
    }
  };

  fetchCustomFurniture();
}, []);

  if (loading) return <div className="container mt-4">Загрузка...</div>;
  if (error) return <div className="container mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <Navbar />
      <h1 className="mb-4">Моя мебель из конструктора</h1>
      <div className="row">
        {furniture.map(item => (
          <div className="col-md-4 mb-4" key={item.id}>
            <FurnitureCard furniture={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomFurniturePage;
