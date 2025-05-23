export interface Shelves{
    color:String;
    id: number;
    heightPercent: number;
}


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
    seats?: number;    // Только для дивана
    hasArmrests?: boolean; // Только для дивана
    legsMaterial?: string; // Только для стола
    material: string;
  }
  