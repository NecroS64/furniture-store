import { useEffect, useState } from "react";
import axios from "axios";
import FurnitureCard from "../components/FurnitureCard";
import {Navbar} from "./CatalogPage"
import { Furniture, Shelves, Seats } from "../types/furniture";

const CustomFurniturePage = () => {
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:3001/api/furniture/custom",{
       withCredentials: true,
    })
      .then(res => {
        setFurniture(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Не удалось загрузить пользовательскую мебель");
        setLoading(false);
      });
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
