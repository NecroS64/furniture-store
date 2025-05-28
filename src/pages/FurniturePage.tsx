import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Furniture,Colors } from "../types/furniture";
import renderPreview  from "../components/FurniturePreview";
import {Navbar} from "./CatalogPage"

const FurniturePage = () => {
  const navigate = useNavigate();
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


  

  const goToConstructor = () => {
    navigate("/constructor", { state: { furniture } });
  };

  return (
    <div className="container mt-5">
      <Navbar/>
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
          {/* <p><strong>Размер:</strong> {furniture.size}</p> */
            // users.find((user) => user.id === 2);
          }
          {/* <p><strong>Цвет:</strong> {furniture.color}</p> */}
          <p><strong>Цвет:</strong> {Colors.find((color)=>color.value===furniture.color)?.name}</p>
          {/* <p><strong>Материал:</strong> {furniture.config.material}</p> */}
          <p><strong>Описание:</strong><br />{furniture.description}</p>
          <button onClick={goToConstructor} className="btn btn-outline-primary mt-3" >
            Открыть в конструкторе
          </button>
        </div>
      </div>
    </div>
  );
};

export default FurniturePage;
