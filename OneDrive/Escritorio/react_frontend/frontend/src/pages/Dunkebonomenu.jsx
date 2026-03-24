import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DunkeBono.css";

export default function DunkeBonoMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    axios.get("/api/user/", { withCredentials: true })
      .then(r => setUser(r.data)).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".dk-user-menu")) setDropdownOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = async () => {
    try { await axios.post("/logout/", {}, { withCredentials: true }); }
    finally { window.location.href = "/login/"; }
  };

  return (
    <div className="dk-page">
      {/* NAVBAR */}
      <nav className={`dk-navbar${navScrolled ? " scrolled" : ""}`}>
        <Link to="/" className="dk-logo-nav">
          <img src="/img/home/logo.png" alt="Popayán Tour Logo" />
        </Link>
        <ul className={`dk-nav-menu${menuOpen ? " active" : ""}`}>
          <li><Link to="/home" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/semana" onClick={() => setMenuOpen(false)}>Semana Santa</Link></li>
          <li><Link to="/sitios-de-interes" onClick={() => setMenuOpen(false)}>Sitios de interés</Link></li>
          <li><Link to="/historia" onClick={() => setMenuOpen(false)}>Historia</Link></li>
          <li><Link to="/entretenimiento" onClick={() => setMenuOpen(false)}>Entretenimiento</Link></li>
        </ul>
        <div className="dk-nav-actions">
          <div className="dk-nav-icons">
            {user ? (
              <div className="dk-user-menu">
                <div className="dk-profile-avatar"
                  onClick={e => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}>
                  <img src={user.imagen_perfil || "/img/default-avatar.png"} alt="Perfil" />
                </div>
                {dropdownOpen && (
                  <div className="dk-dropdown">
                    {user.rol === "empresario" && <Link to="/panel-empresarial"><i className="fas fa-briefcase"></i> Panel Empresarial</Link>}
                    {user.rol === "administrador" && <Link to="/dashboard"><i className="fas fa-tachometer-alt"></i> Dashboard Admin</Link>}
                    <Link to="/perfil"><i className="fas fa-user-edit"></i> Editar Perfil</Link>
                    <a href="#" onClick={e => { e.preventDefault(); setLogoutModal(true); }}>
                      <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="dk-nav-icon"><i className="fas fa-user"></i></Link>
            )}
          </div>
          <div className={`dk-hamburger${menuOpen ? " active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </div>
      </nav>

      {/* MODAL LOGOUT */}
      {logoutModal && (
        <div className="dk-modal-overlay" onClick={() => setLogoutModal(false)}>
          <div className="dk-modal" onClick={e => e.stopPropagation()}>
            <span className="dk-modal-close" onClick={() => setLogoutModal(false)}>&times;</span>
            <h3>Cerrar Sesión</h3>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="dk-modal-actions">
              <button className="dk-btn-cancel" onClick={() => setLogoutModal(false)}>Cancelar</button>
              <button className="dk-btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MENÚ DEL JUEGO */}
      <div className="dk-menu-container">
        <div className="dk-menu-wrapper">
          <h1 className="dk-game-title">DunkeBono</h1>
          <div className="dk-menu-buttons">
            <button onClick={() => navigate("/juegos/dunkebono/jugar")}>Play</button>
            <button onClick={() => navigate("/juegos/dunkebono/creditos")}>Credits</button>
            <button onClick={() => navigate("/entretenimiento")}>Volver</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="dk-footer">
        <div className="dk-footer-content">
          <div className="dk-logo-section">
            <div className="dk-logo-footer"><img src="/img/home/logo_blanco.png" alt="Logo" /></div>
            <div className="dk-linea-horizontal"></div>
          </div>
          <div className="dk-footer-grid">
            <div className="dk-footer-section">
              <h3>Acerca de</h3>
              <ul>
                <li><a href="#">¿Quiénes somos?</a></li>
                <li><Link to="/terminos">Términos y condiciones</Link></li>
              </ul>
            </div>
            <div className="dk-footer-section">
              <h3>Contacto</h3>
              <ul>
                <li>Correo: <br />popayanalltour</li>
                <li>Línea gratuita: <br /> 312 231 1230</li>
              </ul>
            </div>
            <div className="dk-footer-section">
              <h3>Redes Sociales</h3>
              <ul className="dk-social-icons">
                <li><i className="fab fa-instagram"></i><a href="https://www.instagram.com/popayanalltour/">@PopayanAllTour</a></li>
                <li><i className="fab fa-facebook"></i><a href="https://www.facebook.com/profile.php?id=61578069024241">Popayan AllTour</a></li>
                <li><i className="fab fa-youtube"></i> @popayanAlltour5002</li>
              </ul>
            </div>
          </div>
          <div className="dk-footer-bottom">
            <p>&copy; PopayanAllTour | Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}