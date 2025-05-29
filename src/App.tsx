import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import FurniturePage from "./pages/FurniturePage"
import FurnitureConstructor from "./pages/FurnitureConstructor";
import CustomFurniturePage from "./pages/CustomFurniturePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

//npx json-server --watch db.json --port 3001
//npm start

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/furniture/:id" element={<FurniturePage />} />
        <Route path="/constructor" element={<FurnitureConstructor />} />
        <Route path="/custom" element={<CustomFurniturePage />} />
      </Routes>
    </Router>
  );
}

export default App;

