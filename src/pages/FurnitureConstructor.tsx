import React, { useState } from "react";
import {Furniture,Shelves} from "../types/furniture"
import renderPreview  from "../components/FurniturePreview";
type FurnitureType = "шкаф" | "диван" | "стол";



const defaultModels: Record<FurnitureType, Furniture> = {
  шкаф: {
    type: "шкаф",
    width: 90,
    height: 180,
    depth: 50,
    color: "#ffffff",
    material: "дерево",
    shelves: [
      { id: 1, heightPercent: 25,color : "black" },
      { id: 2, heightPercent: 50,color : "black" },
      { id: 3, heightPercent: 75,color : "black" },
    ],
  },
  диван: {
    type: "диван",
    width: 200,
    height: 90,
    depth: 100,
    color: "#777777",
    material: "ткань",
    seats: 3,
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
  const [model, setModel] = useState<Furniture>(defaultModels["шкаф"]);

  const [saveStatus, setSaveStatus] = useState<null | "saving" | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Смена типа мебели и установка дефолтных значений
  const changeType = (type: FurnitureType) => {
    setModel(defaultModels[type]);
  };

  // Универсальные обновления
  const updateField = <K extends keyof Furniture>(
    field: K,
    value: Furniture[K]
  ) => {
    setModel((m) => ({ ...m, [field]: value }));
  };

  // Для шкафа: управление полками
  const addShelf = () => {
    if (!model.shelves) return;
    const newId = model.shelves.length ? Math.max(...model.shelves.map((s) => s.id)) + 1 : 1;
    const newShelf: Shelves = { id: newId, heightPercent: 50,color:"black" };
    updateField("shelves", [...model.shelves, newShelf]);
  };

  const removeShelf = (id: number) => {
    if (!model.shelves) return;
    updateField(
      "shelves",
      model.shelves.filter((s) => s.id !== id)
    );
  };

  const updateShelfPosition = (id: number, heightPercent: number) => {
    if (!model.shelves) return;
    updateField(
      "shelves",
      model.shelves.map((s) => (s.id === id ? { ...s, heightPercent } : s))
    );
  };



  return (
    <div style={{ maxWidth: 800, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Конструктор мебели</h2>

      {/* Выбор типа мебели */}
      <div>
        <label>Тип мебели: </label>
        <select
          value={model.type}
          onChange={(e) => changeType(e.target.value as FurnitureType)}
        >
          <option value="шкаф">Шкаф</option>
          <option value="диван">Диван</option>
          <option value="стол">Стол</option>
        </select>
      </div>

      {/* Размеры */}
      <div style={{ marginTop: 10 }}>
        <label>Ширина (см): </label>
        <input
          type="number"
          min={10}
          max={300}
          value={model.width}
          onChange={(e) => updateField("width", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Высота (см): </label>
        <input
          type="number"
          min={10}
          max={300}
          value={model.height}
          onChange={(e) => updateField("height", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Глубина (см): </label>
        <input
          type="number"
          min={10}
          max={200}
          value={model.depth}
          onChange={(e) => updateField("depth", Number(e.target.value))}
        />
      </div>

      {/* Цвет */}
      <div>
        <label>Цвет: </label>
        <input
          type="color"
          value={model.color}
          onChange={(e) => updateField("color", e.target.value)}
        />
      </div>

      {/* Материал */}
      <div>
        <label>Материал: </label>
        <input
          type="text"
          value={model.material}
          onChange={(e) => updateField("material", e.target.value)}
        />
      </div>

      {/* Дополнительные параметры по типу */}

      {model.type === "шкаф" && (
        <div style={{ marginTop: 20 }}>
          <h3>Полки</h3>
          {model.shelves?.map((shelf) => (
            <div key={shelf.id} style={{ marginBottom: 10 }}>
              <label>Положение полки (% от низа): </label>
              <input
                type="number"
                min={0}
                max={100}
                value={shelf.heightPercent}
                onChange={(e) =>
                  updateShelfPosition(shelf.id, Number(e.target.value))
                }
                style={{ width: 60 }}
              />
              <button onClick={() => removeShelf(shelf.id)} style={{ marginLeft: 10 }}>
                Удалить
              </button>
            </div>
          ))}
          <button onClick={addShelf}>Добавить полку</button>
        </div>
      )}

      {model.type === "диван" && (
        <div style={{ marginTop: 20 }}>
          <h3>Настройки дивана</h3>
          <div>
            <label>Количество сидячих мест: </label>
            <input
              type="number"
              min={1}
              max={6}
              value={model.seats || 1}
              onChange={(e) => updateField("seats", Number(e.target.value))}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={model.hasArmrests || false}
                onChange={(e) => updateField("hasArmrests", e.target.checked)}
              />{" "}
              Подлокотники
            </label>
          </div>
        </div>
      )}

      {model.type === "стол" && (
        <div style={{ marginTop: 20 }}>
          <h3>Настройки стола</h3>
          <div>
            <label>Материал ножек: </label>
            <select
              value={model.legsMaterial || ""}
              onChange={(e) => updateField("legsMaterial", e.target.value)}
            >
              <option value="">-- Выберите материал --</option>
              <option value="металл">Металл</option>
              <option value="дерево">Дерево</option>
              <option value="пластик">Пластик</option>
            </select>
          </div>
        </div>
      )}

      {/* Визуальный предпросмотр */}
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <h3>Предпросмотр</h3>
        {renderPreview(model)}
      </div>
    </div>
  );
};

export default FurnitureConstructor;
