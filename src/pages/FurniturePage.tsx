import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Furniture } from "../types/furniture";
import renderPreview  from "../components/FurniturePreview";


const FurniturePage = () => {
  const { id } = useParams();
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/furniture/${id}`)
      .then(res => {
        setFurniture(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Не удалось загрузить данные");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container mt-5">Загрузка...</div>;
  if (error || !furniture) return <div className="container mt-5">{error || "Мебель не найдена"}</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-3">{furniture.name}</h1>
      <div className="row">
        <div className="col-md-6">
        <div style={{ marginTop: 30, textAlign: "center" }}>
        <h3>Вид</h3>
        {renderPreview(furniture)}
      </div>
        </div>
        <div className="col-md-6">
          <p><strong>Тип:</strong> {furniture.type}</p>
          {/* <p><strong>Размер:</strong> {furniture.size}</p> */}
          <p><strong>Цвет:</strong> {furniture.color}</p>
          {/* <p><strong>Материал:</strong> {furniture.config.material}</p> */}
          <p><strong>Описание:</strong><br />{furniture.description}</p>
          <button className="btn btn-outline-primary mt-3" disabled>
            🔧 Открыть в конструкторе (в разработке)
          </button>
        </div>
      </div>
    </div>
  );
};

export default FurniturePage;
