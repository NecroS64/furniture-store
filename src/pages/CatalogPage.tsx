import { useEffect, useState } from "react";
import axios from "axios";
import { Furniture } from "../types/furniture";
import FurnitureCard from "../components/FurnitureCard";
import Filters from "../components/Filters";
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <Link to="/">Главная</Link> |{' '}
    <Link to="/catalog">Каталог</Link> |{' '}
    <Link to="/constructor">Конструктор мебели</Link>
  </nav>
);
const CatalogPage = () => {
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [filtered, setFiltered] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:3001/furniture")
      .then(response => {
        setFurniture(response.data);
        setFiltered(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Не удалось загрузить данные");
        setLoading(false);
      });
  }, []);

  const handleFilter = (type: string, color: string, size: string) => {
    let result = furniture;
    if (type) result = result.filter(f => f.type === type);
    if (color) result = result.filter(f => f.color === color);
    //if (size) result = result.filter(f => f.size === size);
    setFiltered(result);
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
        <Navbar/>
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

export default CatalogPage;
