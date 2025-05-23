import { Furniture } from "../types/furniture";
import { Link } from "react-router-dom";
import "./FurnitureCard.css"; // подключим стили

const FurnitureCard = ({ furniture }: { furniture: Furniture }) => {
  return (
    <div className="card h-100 shadow-sm furniture-card">
      {/* <img
        src={`/images/${furniture.images[0]}`}
        className="card-img-top object-fit-cover"
        alt={furniture.name}
        style={{ height: "500px",width: "400px", objectFit: "cover" }}
      /> */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{furniture.name}</h5>
        <p className="card-text mb-1"><strong>Тип:</strong> {furniture.type}</p>
        {/* <p className="card-text mb-1"><strong>Размер:</strong> {furniture.width.toString()+" "+furniture.height.toString()+" "+furniture.depth.toString()}</p> */}
        <p className="card-text mb-1"><strong>Цвет:</strong> {furniture.color}</p>
        <p className="card-text text-truncate" title={furniture.description}>
          {furniture.description}
        </p>
        <div className="mt-auto">
          <Link to={`/furniture/${furniture.id}`} className="btn btn-primary w-100">
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FurnitureCard;
