import { useState } from "react";

interface Props {
  onFilter: (type: string, color: string, size: string) => void;
}

const Filters = ({ onFilter }: Props) => {
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const applyFilters = () => {
    onFilter(type, color, size);
  };

  return (
    <div className="mb-4 d-flex gap-3 flex-wrap">
      <select value={type} onChange={(e) => setType(e.target.value)} className="form-select w-auto">
        <option value="">Тип</option>
        <option value="стол">Стол</option>
        <option value="диван">Диван</option>
        <option value="шкаф">Шкаф</option>
      </select>

      <select value={color} onChange={(e) => setColor(e.target.value)} className="form-select w-auto">
        <option value="">Цвет</option>
        <option value="белый">Белый</option>
        <option value="черный">Черный</option>
        <option value="коричневый">Коричневый</option>
      </select>

      <select value={size} onChange={(e) => setSize(e.target.value)} className="form-select w-auto">
        <option value="">Размер</option>
        <option value="180x90x50">180x90x50</option>
        <option value="200x100x60">200x100x60</option>
      </select>

      <button onClick={applyFilters} className="btn btn-outline-primary">
        Применить
      </button>
    </div>
  );
};

export default Filters;
