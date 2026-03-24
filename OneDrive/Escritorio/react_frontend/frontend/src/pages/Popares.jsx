import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Popares.css";

// Ruta base de imágenes del juego
const IMG_BASE = "/img/juego/img/";

// Audio
function useAudio(src) {
  const ref = useRef(null);
  useEffect(() => { ref.current = new Audio(src); }, [src]);
  return ref;
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const TIEMPO_POR_NIVEL = { 1: 60, 2: 50, 3: 40, 4: 30, 5: 20 };

export default function Popares() {
  const navigate    = useNavigate();
  const [user, setUser] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);

  // Estado del juego
  const [numeros,       setNumeros]       = useState(() => shuffleArray([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]));
  const [destapadas,    setDestapadas]    = useState([]); // índices visibles temporalmente
  const [bloqueadas,    setBloqueadas]    = useState([]); // índices ya acertados
  const [seleccion,     setSeleccion]     = useState([]); // [idx, idx] selección actual
  const [movimientos,   setMovimientos]   = useState(0);
  const [aciertos,      setAciertos]      = useState(0);
  const [timer,         setTimer]         = useState(60);
  const [timerActivo,   setTimerActivo]   = useState(false);
  const [nivelActual,   setNivelActual]   = useState(1);
  const [nivelesPasados,setNivelesPasados]= useState(0);
  const [mensajeExtra,  setMensajeExtra]  = useState("");
  const [gameOver,      setGameOver]      = useState(false);
  const [ganador,       setGanador]       = useState(false);
  const [procesando,    setProcesando]    = useState(false);

  const timerRef     = useRef(null);
  const timerInicial = useRef(60);

  // Audios
  const winAudio   = useAudio("/sounds/win.mp3");
  const loseAudio  = useAudio("/sounds/lose.mp3");
  const clickAudio = useAudio("/sounds/click.mp3");
  const rightAudio = useAudio("/sounds/right.mp3");
  const wrongAudio = useAudio("/sounds/wrong.mp3");

  const playAudio = (ref) => { try { ref.current?.play(); } catch {} };

  // Auth
  useEffect(() => {
    axios.get("/api/user/", { withCredentials: true }).then(r => setUser(r.data)).catch(() => {});
  }, []);

  // Navbar scroll
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!timerActivo) return;
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          setTimerActivo(false);
          playAudio(loseAudio);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActivo]);

  // Reiniciar juego
  const reiniciar = useCallback((nivel = nivelActual) => {
    clearInterval(timerRef.current);
    const t = TIEMPO_POR_NIVEL[nivel] || 60;
    timerInicial.current = t;
    setTimer(t);
    setTimerActivo(false);
    setMovimientos(0);
    setAciertos(0);
    setNumeros(shuffleArray([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]));
    setDestapadas([]);
    setBloqueadas([]);
    setSeleccion([]);
    setMensajeExtra("");
    setGameOver(false);
    setGanador(false);
    setProcesando(false);
  }, [nivelActual]);

  // Auto-reinicio tras game over
  useEffect(() => {
    if (!gameOver) return;
    const t = setTimeout(() => reiniciar(), 3000);
    return () => clearTimeout(t);
  }, [gameOver, reiniciar]);

  // Click en tarjeta
  const destapar = (idx) => {
    if (procesando) return;
    if (bloqueadas.includes(idx)) return;
    if (seleccion.includes(idx)) return;
    if (seleccion.length >= 2) return;

    playAudio(clickAudio);
    if (!timerActivo && !gameOver) setTimerActivo(true);

    const nuevaSeleccion = [...seleccion, idx];
    setSeleccion(nuevaSeleccion);
    setDestapadas(d => [...d, idx]);

    if (nuevaSeleccion.length === 2) {
      const [a, b] = nuevaSeleccion;
      setMovimientos(m => m + 1);
      setProcesando(true);

      if (numeros[a] === numeros[b]) {
        // Acierto
        playAudio(rightAudio);
        const nuevosAciertos = aciertos + 1;
        setAciertos(nuevosAciertos);
        setBloqueadas(bl => [...bl, a, b]);
        setSeleccion([]);
        setProcesando(false);

        if (nuevosAciertos === 8) {
          clearInterval(timerRef.current);
          setTimerActivo(false);
          playAudio(winAudio);
          const t = TIEMPO_POR_NIVEL[nivelActual] || 60;
          setMensajeExtra(`¡Fantástico! Solo demoraste ${timerInicial.current - timer} segundos`);
          setGanador(true);

          if (nivelActual < 5) {
            const nuevoNivel = nivelActual + 1;
            setNivelActual(nuevoNivel);
            setNivelesPasados(n => n + 1);
            setTimeout(() => reiniciar(nuevoNivel), 5000);
          } else {
            setMensajeExtra("¡Felicidades! ¡Has completado todos los niveles!");
          }
        }
      } else {
        // Error
        playAudio(wrongAudio);
        setTimeout(() => {
          setDestapadas(d => d.filter(i => i !== a && i !== b));
          setSeleccion([]);
          setProcesando(false);
        }, 800);
      }
    }
  };

  const esVisible = (idx) => destapadas.includes(idx) || bloqueadas.includes(idx);

  return (
    <div className="po-page">
      {/* NAVBAR */}
      <nav className={`po-navbar${navScrolled ? " scrolled" : ""}`}>
        <Link to="/" className="po-logo-nav"><img src="/img/home/logo.png" alt="Logo" /></Link>
        <ul className={`po-nav-menu${menuOpen ? " active" : ""}`}>
          <li><Link to="/home" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/semana" onClick={() => setMenuOpen(false)}>Semana Santa</Link></li>
          <li><Link to="/sitios-de-interes" onClick={() => setMenuOpen(false)}>Sitios de interés</Link></li>
          <li><Link to="/historia" onClick={() => setMenuOpen(false)}>Historia</Link></li>
          <li><Link to="/entretenimiento" onClick={() => setMenuOpen(false)}>Entretenimiento</Link></li>
        </ul>
        <div className="po-nav-actions">
          <div className="po-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </div>
      </nav>

      {/* TABLERO */}
      <main className="po-main">
        <section className="po-section1">
          <h1>Popares</h1>

          {/* Overlay game over / win */}
          {(gameOver || ganador) && (
            <div className="po-overlay">
              {gameOver && <p className="po-msg-lose">¡Tiempo agotado! Reiniciando...</p>}
              {ganador  && <p className="po-msg-win">{mensajeExtra || "¡Ganaste!"}</p>}
            </div>
          )}

          <table className="po-table">
            <tbody>
              {[0,1,2,3].map(row => (
                <tr key={row}>
                  {[0,1,2,3].map(col => {
                    const idx = row * 4 + col;
                    const visible = esVisible(idx);
                    return (
                      <td key={col}>
                        <button
                          className={`po-card${visible ? " flipped" : ""}${bloqueadas.includes(idx) ? " matched" : ""}`}
                          onClick={() => destapar(idx)}
                          disabled={bloqueadas.includes(idx) || gameOver}
                        >
                          {visible
                            ? <img src={`${IMG_BASE}${numeros[idx]}.jpg`} alt={`carta ${numeros[idx]}`} />
                            : null
                          }
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="po-section2">
          <div className="po-stat">Aciertos: {aciertos}{aciertos === 8 ? " 🥳" : ""}</div>
          <div className="po-stat">
            {gameOver
              ? "¡Tiempo agotado!"
              : timerActivo
              ? `Tiempo: ${timer} segundos`
              : `Tiempo: ${timer} segundos`}
          </div>
          <div className="po-stat">Movimientos: {movimientos}{aciertos === 8 ? " 😎" : ""}</div>
          <div className="po-stat po-niveles">Niveles Pasados: {nivelesPasados}</div>
          <button className="po-btn-volver" onClick={() => navigate("/entretenimiento")}>
            ← Volver
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="po-footer">
        <div className="po-footer-content">
          <div className="po-logo-section">
            <div className="po-logo-footer"><img src="/img/home/logo_blanco.png" alt="Logo" /></div>
            <div className="po-linea-horizontal"></div>
          </div>
          <div className="po-footer-grid">
            <div className="po-footer-section"><h3>Acerca de</h3><ul><li><a href="#">¿Quiénes somos?</a></li><li><Link to="/terminos">Términos y condiciones</Link></li></ul></div>
            <div className="po-footer-section"><h3>Contacto</h3><ul><li>Correo: <br />popayanalltour</li><li>Línea gratuita: <br />312 231 1230</li></ul></div>
            <div className="po-footer-section"><h3>Redes Sociales</h3><ul className="po-social-icons"><li><i className="fab fa-instagram"></i><a href="https://www.instagram.com/popayanalltour/">@PopayanAllTour</a></li><li><i className="fab fa-facebook"></i><a href="https://www.facebook.com/profile.php?id=61578069024241">Popayan AllTour</a></li><li><i className="fab fa-youtube"></i> @popayanAlltour5002</li></ul></div>
          </div>
          <div className="po-footer-bottom"><p>&copy; PopayanAllTour | Todos los derechos reservados</p></div>
        </div>
      </footer>
    </div>
  );
}