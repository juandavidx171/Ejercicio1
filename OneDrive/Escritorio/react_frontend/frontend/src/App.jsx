import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SemanaSanta from "./pages/SemanaSanta";
import Procesiones from "./pages/Procesiones";
import Historia from "./pages/Historia";
import Entretenimiento from "./pages/Entretenimiento";
import DunkeBonoMenu    from "./pages/DunkeBonoMenu";
import DunkeBonoJuego   from "./pages/DunkeBonoJuego";
import DunkeBonoCreditos from "./pages/DunkeBonoCreditos";
import Popares          from "./pages/Popares";






export default function App() {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/semana" element={<SemanaSanta />} />
          <Route path="/procesiones" element={<Procesiones />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/historia/:ano" element={<Historia />} />
          <Route path="/entretenimiento" element={<Entretenimiento />} />
          <Route path="/juegos/dunkebono"          element={<DunkeBonoMenu />} />
          <Route path="/juegos/dunkebono/jugar"    element={<DunkeBonoJuego />} />
          <Route path="/juegos/dunkebono/creditos" element={<DunkeBonoCreditos />} />
          <Route path="/juegos/popares"            element={<Popares />} />

          




        </Routes>
      </BrowserRouter>
    </div>
  );
}
