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
    axios.get("http://localhost:3001/api/admin", { withCredentials: true })
      .then(response => {
        setFurniture(response.data);
        setFiltered(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const message = error.response?.data?.error || error.message || "Не удалось загрузить данные";
        setError(message);
        setLoading(false);
      });
  }, []);

  const handleFilter = (
    type: string,
    color: string,
    width?: number,
    height?: number,
    depth?: number
  ) => {
    const params = new URLSearchParams();

    if (type) params.append("type", type);
    if (color) params.append("color", color);
    if (width !== undefined) params.append("width", width.toString());
    if (height !== undefined) params.append("height", height.toString());
    if (depth !== undefined) params.append("depth", depth.toString());

    axios.get(`http://localhost:3001/api/admin/filter?${params.toString()}`, { withCredentials: true })
      .then(response => setFiltered(response.data))
      .catch(() => setError("Не удалось применить фильтр"));
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/admin/delete/${id}`, { withCredentials: true });
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
