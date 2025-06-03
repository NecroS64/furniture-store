import { useLocation } from "react-router-dom";
import React, {useEffect, useState } from "react";
import { Furniture, Shelves, Seats } from "../types/furniture";
import renderPreview from "../components/FurniturePreview";
import "bootstrap/dist/css/bootstrap.min.css";
import {Navbar} from "./CatalogPage"

type FurnitureType = "шкаф" | "диван" | "стол";
// const Navbar = () => (
//   <nav>
//     <Link to="/">Главная</Link> |{' '}
//     <Link to="/catalog">Каталог</Link> |{' '}
//     <Link to="/constructor">Конструктор мебели</Link>
//   </nav>
// );

const defaultModels: Record<FurnitureType, Furniture> = {
  шкаф: {
    type: "шкаф",
    width: 90,
    height: 180,
    depth: 50,
    color: "#ffffff",
    material: "дерево",
    shelves: [
      { id: 1, heightPercent: 25, color: "black" },
      { id: 2, heightPercent: 50, color: "black" },
      { id: 3, heightPercent: 75, color: "black" },
    ],
  },
  диван: {
    type: "диван",
    width: 200,
    height: 90,
    depth: 100,
    color: "#777777",
    material: "ткань",
    seats: [
      { color: "black", id: 1 },
      { color: "black", id: 2 },
      { color: "black", id: 3 },
    ],
    hasArmrests: true,
  },
  стол: {
    type: "стол",
    width: 140,
    height: 75,
    depth: 80,
    color: "#8B4513",
    material: "массив дуба",
    legsMaterial: "металл",
  },
};

const FurnitureConstructor = () => {
  const location = useLocation();
  const initialFurniture = location.state?.furniture;

  const [model, setModel] = useState<Furniture>(initialFurniture ||defaultModels["шкаф"]);

  const [saveStatus, setSaveStatus] = useState<null | "saving" | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const changeType = (type: FurnitureType) => {
    setModel(defaultModels[type]);
  };

  const updateField = <K extends keyof Furniture>(field: K, value: Furniture[K]) => {
    setModel((m) => ({ ...m, [field]: value }));
  };

  const addShelf = () => {
    if (!model.shelves) return;
    const newId = model.shelves.length ? Math.max(...model.shelves.map((s) => s.id)) + 1 : 1;
    const newShelf: Shelves = { id: newId, heightPercent: 50, color: "black" };
    updateField("shelves", [...model.shelves, newShelf]);
  };

  const removeShelf = (id: number) => {
    if (!model.shelves) return;
    updateField("shelves", model.shelves.filter((s) => s.id !== id));
  };

  const updateShelfPosition = (id: number, heightPercent: number) => {
    if (!model.shelves) return;
    updateField("shelves", model.shelves.map((s) => (s.id === id ? { ...s, heightPercent } : s)));
  };


  
const saveModel = async () => {
  setSaveStatus("saving");

  const sendRequest = async (token: string | null) => {
    const response = await fetch("http://localhost:3001/api/customFurniture", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(model),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("unauthorized");
      else throw new Error("Ошибка при сохранении");
    }

    return response;
  };

  try {
    let token = localStorage.getItem("accessToken");
    try {
      await sendRequest(token);
      setSaveStatus("success");
    } catch (err: any) {
      if (err.message === "unauthorized") {
        // Попробовать обновить токен
        const refreshResp = await fetch("http://localhost:3001/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (!refreshResp.ok) throw new Error("Не удалось обновить токен");

        const data = await refreshResp.json();
        localStorage.setItem("accessToken", data.accessToken);

        // Повторить запрос
        await sendRequest(data.accessToken);
        setSaveStatus("success");
      } else {
        throw err;
      }
    }
  } catch (err: any) {
    setSaveStatus("error");
    setErrorMessage(err.message);
  }
};


 return (
    <div className="container mt-4">
      <Navbar />
      <h2 className="mb-4">Конструктор мебели</h2>

      <div className="mb-3">
        <label className="form-label">Тип мебели:</label>
        <select
          className="form-select"
          value={model.type}
          onChange={(e) => changeType(e.target.value as FurnitureType)}
        >
          <option value="шкаф">Шкаф</option>
          <option value="диван">Диван</option>
          <option value="стол">Стол</option>
        </select>
      </div>

      <div className="row">
        {["width", "height", "depth"].map((dim) => (
          <div className="col-md-4 mb-3" key={dim}>
            <label className="form-label">{dim === "width" ? "Ширина" : dim === "height" ? "Высота" : "Глубина"} (см):</label>
            <input
              type="number"
              className="form-control"
              min={10}
              max={dim === "depth" ? 200 : 300}
              value={Number(model[dim as "width" | "height" | "depth"])}
              onChange={(e) => updateField(dim as keyof Furniture, Number(e.target.value))}
            />

          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Цвет:</label>
        <input
          type="color"
          className="form-control form-control-color"
          value={model.color}
          onChange={(e) => updateField("color", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Материал:</label>
        <input
          type="text"
          className="form-control"
          value={model.material}
          onChange={(e) => updateField("material", e.target.value)}
        />
      </div>

      {model.type === "шкаф" && (
        <div className="mb-4">
          <h4>Полки</h4>
          {model.shelves?.map((shelf) => (
            <div className="input-group mb-2" key={shelf.id}>
              <span className="input-group-text">Положение (%):</span>
              <input
                type="number"
                className="form-control"
                min={0}
                max={100}
                value={shelf.heightPercent}
                onChange={(e) => updateShelfPosition(shelf.id, Number(e.target.value))}
              />
              <button className="btn btn-outline-danger" onClick={() => removeShelf(shelf.id)}>Удалить</button>
            </div>
          ))}
          <button className="btn btn-outline-primary" onClick={addShelf}>Добавить полку</button>
        </div>
      )}

      {model.type === "диван" && (
        <div className="mb-4">
          <h4>Настройки дивана</h4>

          <div className="mb-2">
            <label className="form-label">Количество сидений:</label>
            <input
              type="number"
              className="form-control"
              min={1}
              max={6}
              value={model.seats?.length || 1}
              onChange={(e) => {
                const count = Number(e.target.value);
                const newSeats = Array.from({ length: count }, (_, i) => ({
                  id: i + 1,
                  color: model.seats?.[0]?.color || "black",
                }));
                updateField("seats", newSeats);
              }}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Цвет сидений:</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={model.seats?.[0]?.color || "#000000"}
              onChange={(e) => {
                const color = e.target.value;
                updateField(
                  "seats",
                  model.seats?.map((seat) => ({ ...seat, color })) || []
                );
              }}
            />
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={model.hasArmrests || false}
              onChange={(e) => updateField("hasArmrests", e.target.checked)}
              id="armrestsCheck"
            />
            <label className="form-check-label" htmlFor="armrestsCheck">
              Подлокотники
            </label>
          </div>
        </div>
      )}

      {model.type === "стол" && (
        <div className="mb-4">
          <h4>Настройки стола</h4>
          <label className="form-label">Материал ножек:</label>
          <select
            className="form-select"
            value={model.legsMaterial || ""}
            onChange={(e) => updateField("legsMaterial", e.target.value)}
          >
            <option value="">-- Выберите материал --</option>
            <option value="металл">Металл</option>
            <option value="дерево">Дерево</option>
            <option value="пластик">Пластик</option>
          </select>
        </div>
      )}

      <div className="text-center my-4">
        <h4>Предпросмотр</h4>
        {renderPreview(model)}
      </div>

      <div className="text-center mb-5">
        <button className="btn btn-success px-4 py-2" onClick={saveModel}>
          Сохранить модель
        </button>
        <div className="mt-3">
          {saveStatus === "saving" && <span className="text-muted">Сохраняем...</span>}
          {saveStatus === "success" && <span className="text-success">Успешно сохранено!</span>}
          {saveStatus === "error" && <span className="text-danger">Ошибка: {errorMessage}</span>}
        </div>
      </div>
    </div>
  );
};

export default FurnitureConstructor;
