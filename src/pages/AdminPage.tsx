import { useEffect, useState } from "react";
import axios from "axios";
import { Furniture,Colors } from "../types/furniture";
import FurnitureCard from "../components/FurnitureCard";
import Filters from "../components/Filters";
import { Link } from 'react-router-dom';
import { response } from "express";
import { cookie } from "express-validator";

export const Navbar = () => (
  <nav>
    <Link to="/">Главная</Link> |{' '}
    <Link to="/catalog">Каталог</Link> |{' '}
    <Link to="/constructor">Конструктор мебели</Link> |{' '}
    <Link to="/custom">Моя мебель</Link>

  </nav>
);
const AdminPage = () => {
    const [furniture, setFurniture] = useState<Furniture[]>([]);
    const [filtered, setFiltered] = useState<Furniture[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // axios.get("http://localhost:3001/furniture")
    axios.get("http://localhost:3001/api/admin/furniture",{
        withCredentials: true,
    })
      .then(response => {
        setFurniture(response.data);
        setFiltered(response.data);
        setLoading(false);
      })
      .catch((error) => {
  const message =
    error.response?.data?.error || // если сервер вернул { error: "..." }
    error.message ||               // если это ошибка axios/сети
    "Не удалось загрузить данные";

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

  axios
    .get(`http://localhost:3001/api/furniture/filter?${params.toString()}`)
    .then((response) => {
      setFiltered(response.data);
    })
    .catch(() => {
      setError("Не удалось применить фильтр");
    });
};


  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
        
      <h1 className="mb-4">Каталог мебели</h1>
      <Filters onFilter={handleFilter} />
      <div className="row">
        {filtered.map(item => (
          <div className="col-md-4 mb-4" key={item.id}>
            <FurnitureCard furniture={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
