import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import FurniturePage from "./pages/FurniturePage"
import FurnitureConstructor from "./pages/FurnitureConstructor";

//npx json-server --watch db.json --port 3001
//npm start

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/furniture/:id" element={<FurniturePage />} />
        <Route path="/constructor" element={<FurnitureConstructor />} />
      </Routes>
    </Router>
  );
}

export default App;

