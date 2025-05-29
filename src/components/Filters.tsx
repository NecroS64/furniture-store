import { useState } from "react";
import { Colors } from "../types/furniture"; // путь к файлу с export const Colors = [...]

interface Props {
  onFilter: (
    type: string,
    color: string,
    width?: number,
    height?: number,
    depth?: number
  ) => void;
}

const Filters = ({ onFilter }: Props) => {
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");

  const applyFilters = () => {
    onFilter(
      type,
      color,
      width ? parseInt(width) : undefined,
      height ? parseInt(height) : undefined,
      depth ? parseInt(depth) : undefined
    );
  };

  return (
    <div className="mb-4 d-flex gap-3 flex-wrap align-items-center">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="form-select w-auto"
      >
        <option value="">Тип</option>
        <option value="стол">Стол</option>
        <option value="диван">Диван</option>
        <option value="шкаф">Шкаф</option>
      </select>

      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="form-select w-auto"
      >
        <option value="">Цвет</option>
        {Colors.map((c) => (
          <option key={c.value} value={c.value}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Ширина (мм)"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        className="form-control w-auto"
      />
      <input
        type="number"
        placeholder="Высота (мм)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        className="form-control w-auto"
      />
      <input
        type="number"
        placeholder="Глубина (мм)"
        value={depth}
        onChange={(e) => setDepth(e.target.value)}
        className="form-control w-auto"
      />

      <button onClick={applyFilters} className="btn btn-outline-primary">
        Применить
      </button>
    </div>
  );
};

export default Filters;
