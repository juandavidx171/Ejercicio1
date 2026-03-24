import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./DunkeBono.css";
const bgImg = new Image();
bgImg.src = "/img/juego/imagen_juego.png";

export default function DunkeBonoCreditos() {
  const navigate = useNavigate();
  const iconsRef = useRef(null);

  useEffect(() => {
    const icons = ["⭐","🎮","🎯","⚡","🎨","🔥","💫","🎪"];
    const container = iconsRef.current;
    if (!container) return;
    const interval = setInterval(() => {
      const el = document.createElement("div");
      el.className = "dk-credits-icon";
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDuration = (Math.random() * 3 + 4) + "s";
      el.style.color = `hsl(${Math.random() * 360},70%,60%)`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 7000);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const credits = [
    { role: "Creador del Juego",  name: "Diego Orozco" },
    { role: "Programación",       name: "Diego Orozco" },
    { role: "Diseño de Juego",    name: "Diego Orozco" },
    { role: "Arte y Gráficos",    name: "Diego Orozco y Alejandro Suarez" },
  ];

  return (
    <div className="dk-credits-page">
      <div ref={iconsRef} className="dk-credits-icons-bg"></div>
      <div className="dk-credits-container">
        <h1 className="dk-credits-title">DunkeBono 🫓☕</h1>
        <p className="dk-credits-subtitle">Un proyecto creado con amor y paciencia</p>

        {credits.map((c, i) => (
          <div key={i} className="dk-credits-section">
            <div className="dk-credits-role">{c.role}</div>
            <div className="dk-credits-name">{c.name}</div>
          </div>
        ))}

        <div className="dk-credits-thanks">
          <div className="dk-credits-ty">¡Gracias por Jugar!</div>
          <p>Este juego fue desarrollado con dedicación y cariño. Espero que disfrutes la experiencia tanto como yo disfruté creándola.</p>
        </div>

        <button className="dk-credits-back" onClick={() => navigate("/juegos/dunkebono/jugar")}>
          ← Volver al Juego
        </button>
      </div>
    </div>
  );
}