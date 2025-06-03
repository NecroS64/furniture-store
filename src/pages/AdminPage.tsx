import { useEffect, useState } from "react";
import axios from "axios";
import { Furniture,Colors } from "../types/furniture";
import FurnitureCard from "../components/FurnitureCard";
import Filters from "../components/Filters";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("accessToken");
      navigate("/");

    } catch (err) {
      console.error("Ошибка при выходе:", err);
    }
    navigate("/");
  };

  return (
    <nav>
      <button onClick={handleLogout} className="btn btn-link p-0">Выход</button>
    </nav>
  );
};

const AdminPage = () => {
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [filtered, setFiltered] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      let token = localStorage.getItem("accessToken");

      const response = await axios.get("http://localhost:3001/api/admin", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setFurniture(response.data);
      setFiltered(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await axios.post(
            "http://localhost:3001/api/auth/refresh",
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          const retryResponse = await axios.get("http://localhost:3001/api/admin", {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            withCredentials: true,
          });

          setFurniture(retryResponse.data);
          setFiltered(retryResponse.data);
        } catch (refreshError) {
          setError("Авторизация истекла. Пожалуйста, войдите снова.");
        }
      } else {
        setError("Не удалось загрузить данные");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  const handleFilter = async (
  type: string,
  color: string,
  width?: number,
  height?: number,
  depth?: number
) => {
  try {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (color) params.append("color", color);
    if (width !== undefined) params.append("width", width.toString());
    if (height !== undefined) params.append("height", height.toString());
    if (depth !== undefined) params.append("depth", depth.toString());

    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`http://localhost:3001/api/admin/filter?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    setFiltered(response.data);
  } catch {
    setError("Не удалось применить фильтр");
  }
};


  const handleDelete = async (id: number) => {
  try {
    const token = localStorage.getItem("accessToken");

    await axios.delete(`http://localhost:3001/api/admin/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    setFurniture(prev => prev.filter(f => f.id !== id));
    setFiltered(prev => prev.filter(f => f.id !== id));
  } catch {
    setError("Не удалось удалить мебель");
  }
};


  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <Navbar />
      <h1 className="mb-4">Каталог пользовательской мебели</h1>
      <Filters onFilter={handleFilter} />
      <div className="row">
        {filtered.map(item => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{item.type}</h5>
                <p><strong>Цвет:</strong> {Colors.find(color => color.value === item.color)?.name || "Пользовательский"}</p>
                <p><strong>Автор:</strong> {item.username || "Неизвестно"}</p>
                <button className="btn btn-danger" onClick={() => handleDelete(item.id!!)}>Удалить</button>
                <Link to={`/furniture/${item.id}`} className="btn btn-primary">
                    Подробнее
                  </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
