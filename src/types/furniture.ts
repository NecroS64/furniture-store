export interface Shelves{
    color:string;
    id: number;
    heightPercent: number;
}



export interface Seats{
    color:string;
    id: number;
}

export const Colors = [
  { name: "Белый", value: "#ffffff" },
  { name: "Серый", value: "#999999" },
  { name: "Чёрный", value: "#333232" },
  { name: "Коричневый", value: "#8b4513" },
  { name: "Красный", value: "#FF0000" },
  { name: "Желтый", value: "#FFFF00" },
  { name: "Фиолетовый", value: "#800080" },
  { name: "Синий", value: "#0000FF" },
  { name: "Зеленый", value: "#008000" },
];

export interface Furniture {
    id?: number;
    type?: string;
    color?: string;
    width: number,
    height: number,
    depth: number,
    name?: string;
    description?: string;
    images?: string[];
    
    shelves?: Shelves[];
    seats?: Seats[];    // Только для дивана
    hasArmrests?: boolean; // Только для дивана
    legsMaterial?: string; // Только для стола
    material: string;
  }
  