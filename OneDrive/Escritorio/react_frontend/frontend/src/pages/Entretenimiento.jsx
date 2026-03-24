import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Entretenimiento.css";

const JUEGOS = [
  {
    id: "dunkebono",
    img: "/img/entretenimiento/image 288.png",
    titulo: "Dunkebono",
    descripcion:
      "Tu misión es lanzar pandebonos desde un cañón y encestarlos en una taza de café caliente. Inspirado en una costumbre payanesa, este juego pone a prueba tu puntería.",
    ruta: "/juegos/dunkebono",
  },
  {
    id: "popares",
    img: "/img/entretenimiento/flux1.png",
    titulo: "Popares",
    descripcion:
      "Cada imagen revela pedazos de tradición que desafían tu mente y tu memoria visual en una carrera contra el tiempo y los descuidos del recuerdo.",
    ruta: "/juegos/popares",
  },
  {
    id: "cirogoal",
    img: "/img/entretenimiento/gol.png",
    titulo: "Cirogoal",
    descripcion:
      'Adéntrate en el humilde estadio de la ciudad blanca, el estadio "Ciro López", para usar tu habilidad para saltar, cabecear y anotar golazos en este divertido mini juego de fútbol.',
    ruta: "/juegos/cirogoal",
  },
];

export default function Entretenimiento() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  // ── Auth ──
  useEffect(() => {
    axios
      .get("/api/user/", { withCredentials: true })
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));
  }, []);

  // ── Navbar scroll ──
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Cerrar dropdown al click fuera ──
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".en-user-menu")) setDropdownOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/logout/", {}, { withCredentials: true });
      window.location.href = "/login/";
    } catch {
      window.location.href = "/login/";
    }
  };

  return (
    <div className="en-page">
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className={`en-navbar${navScrolled ? " scrolled" : ""}`} id="navbar">
        <Link to="/" className="en-logo-nav">
          <img src="/img/entretenimiento/logo.png" alt="Popayán Tour Logo" />
        </Link>

        <ul className={`en-nav-menu${menuOpen ? " active" : ""}`} id="nav-menu">
          <li><Link to="/home" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/semana" onClick={() => setMenuOpen(false)}>Semana Santa</Link></li>
          <li><Link to="/sitios-de-interes" onClick={() => setMenuOpen(false)}>Sitios de interés</Link></li>
          <li><Link to="/historia" onClick={() => setMenuOpen(false)}>Historia</Link></li>
          <li><Link to="/entretenimiento" onClick={() => setMenuOpen(false)}>Entretenimiento</Link></li>
        </ul>

        <div className="en-nav-actions">
          <div className="en-nav-icons">
            {user ? (
              <div className="en-user-menu">
                <div
                  className="en-profile-avatar"
                  onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                  title="Menú de usuario"
                >
                  <img src={user.imagen_perfil || "/img/default-avatar.png"} alt="Perfil" />
                </div>
                {dropdownOpen && (
                  <div className="en-dropdown">
                    {user.rol === "empresario" && (
                      <Link to="/panel-empresarial"><i className="fas fa-briefcase"></i> Panel Empresarial</Link>
                    )}
                    {user.rol === "administrador" && (
                      <Link to="/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard Admin</Link>
                    )}
                    <Link to="/perfil"><i className="fas fa-user-edit"></i> Editar Perfil</Link>
                    <a href="#" onClick={(e) => { e.preventDefault(); setDropdownOpen(false); setLogoutModal(true); }}>
                      <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="en-nav-icon" title="Iniciar sesión">
                <i className="fas fa-user"></i>
              </Link>
            )}
          </div>
          <div
            className={`en-hamburger${menuOpen ? " active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </div>
      </nav>

      {/* ═══════════════ MODAL LOGOUT ═══════════════ */}
      {logoutModal && (
        <div className="en-modal-overlay" onClick={() => setLogoutModal(false)}>
          <div className="en-modal" onClick={(e) => e.stopPropagation()}>
            <span className="en-modal-close" onClick={() => setLogoutModal(false)}>&times;</span>
            <h3>Cerrar Sesión</h3>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="en-modal-actions">
              <button className="en-btn-cancel" onClick={() => setLogoutModal(false)}>Cancelar</button>
              <button className="en-btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ HERO ═══════════════ */}
      <div className="en-hero">
        <img
          src="/img/entretenimiento/pixelcut-export (2) 1.jpg"
          alt="Popayán Landscape"
          className="en-header-image"
        />
        <div className="en-location-text">
          <h1>CATÁLOGO DE JUEGOS</h1>
          <div className="en-header-line"></div>
          <p>
            ¿Exploraste Popayán y aún te queda energía? ¡Hora de jugar!<br />
            Aquí la diversión no solo está en sus calles, también está en nuestra
            sección de entretenimiento. Tenemos tres juegos listos para desafiar tu
            habilidad y hacerte pasar un rato increíble. ¿Podrás superar los retos?
            <br /><br />¡Demuéstralo y conviértete en un campeón payanés!
          </p>
        </div>
        <div className="en-down">
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      {/* ═══════════════ CARDS DE JUEGOS ═══════════════ */}
      <section className="en-card-container">
        {JUEGOS.map((juego) => (
          <div key={juego.id} className="en-card">
            <img src={juego.img} alt={juego.titulo} />
            <h3>{juego.titulo}</h3>
            <hr />
            <p>{juego.descripcion}</p>
            <button onClick={() => navigate(juego.ruta)}>JUGAR</button>
          </div>
        ))}
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="en-footer">
        <div className="en-footer-content">
          <div className="en-logo-section">
            <div className="en-logo-footer">
              <img src="/img/home/logo_blanco.png" alt="Logo Popayán Tour" />
            </div>
            <div className="en-linea-horizontal"></div>
          </div>
          <div className="en-footer-grid">
            <div className="en-footer-section">
              <h3>Acerca de</h3>
              <ul>
                <li><a href="#">¿Quiénes somos?</a></li>
                <li><Link to="/terminos">Términos y condiciones</Link></li>
              </ul>
            </div>
            <div className="en-footer-section">
              <h3>Contacto</h3>
              <ul>
                <li>Correo: <br />popayanalltour</li>
                <li>Línea gratuita: <br /> 312 231 1230</li>
              </ul>
            </div>
            <div className="en-footer-section">
              <h3>Redes Sociales</h3>
              <ul className="en-social-icons">
                <li><i className="fab fa-instagram"></i><a href="https://www.instagram.com/popayanalltour/">@PopayanAllTour</a></li>
                <li><i className="fab fa-facebook"></i><a href="https://www.facebook.com/profile.php?id=61578069024241">Popayan AllTour</a></li>
                <li><i className="fab fa-youtube"></i> @popayanAlltour5002</li>
              </ul>
            </div>
          </div>
          <div className="en-footer-bottom">
            <p>&copy; PopayanAllTour | Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}