import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const SLIDER_IMAGES = [
  "/img/home/1home.webp","/img/home/2home.webp","/img/home/3home.webp",
  "/img/home/Home_4.webp","/img/home/Home_5.webp","/img/home/6home.webp",
  "/img/home/Home_7.webp","/img/home/Home_8.webp",
];
const CARRUSEL_1 = [
  { src:"/img/home/galeria/carrusel_1.png", w:250, h:300 },
  { src:"/img/home/galeria/carrusel_2.png", w:500, h:300 },
  { src:"/img/home/galeria/carrusel_3.png", w:278, h:300 },
];
const CARRUSEL_2 = [
  { src:"/img/home/galeria/carrusel_4.png", w:250, h:320 },
  { src:"/img/home/galeria/carrusel_5.png", w:400, h:300 },
  { src:"/img/home/galeria/carrusel_6.png", w:350, h:300 },
];
const CARRUSEL_3 = [
  { src:"/img/home/galeria/carrusel_7.png",  w:350, h:320 },
  { src:"/img/home/galeria/carrusel_8.png",  w:250, h:300 },
  { src:"/img/home/galeria/carrusel_9.png",  w:250, h:300 },
  { src:"/img/home/galeria/carrusel_10.png", w:250, h:300 },
];
const CARRUSEL_4 = [
  { src:"/img/home/galeria/carrusel_11.png", w:450, h:320 },
  { src:"/img/home/galeria/carrusel_12.png", w:450, h:300 },
];
const CARDS = [
  { fondo:"/img/home/fondo-1.png", flotante:"/img/home/sobresale-1.png", titulo:"Centro histórico", desc:"Camina por las calles empedradas y admira la arquitectura colonial.", top:"-95px", h:"295px" },
  { fondo:"/img/home/fondo-2.png", flotante:"/img/home/sobresale-2.png", titulo:"Gastronomía típica", desc:"Deléitate con los sabores tradicionales del Cauca: empanadas, carantanta y tamales.", top:"-54px", h:"254px" },
  { fondo:"/img/home/fondo-3.png", flotante:"/img/home/sobresale-3.png", titulo:"Museos y cultura", desc:"Explora la rica historia en museos y casas coloniales que albergan tesoros únicos.", top:"-164px", h:"365px" },
  { fondo:"/img/home/fondo-4.png", flotante:"/img/home/sobresale-4.png", titulo:"Hotelería", desc:"Opciones que combinan la tradición colonial con la comodidad moderna.", top:"-40px", h:"70px" },
  { fondo:"/img/home/fondo-5.jpg", flotante:"/img/home/sobresale-5.png", titulo:"Restaurantes", desc:"Experiencia gastronómica con platos tradicionales y sabores locales.", top:"-50px", h:"250px" },
  {
    fondo:"/img/home/fondo-6.png", flotante:"/img/home/sobresale-6.png", titulo:"Historia",
    desc:"Ciudad famosa por su arquitectura colonial, rica historia y tradiciones.", top:"-48px", left:"52px", h:"206px",
    extras:[
      { src:"/img/home/sobresale-6-1.png", style:{ position:"absolute", top:"1px",   left:"62%", transform:"translateX(-50%)", height:"200px", zIndex:10 } },
      { src:"/img/home/sobresale-6-2.png", style:{ position:"absolute", top:"0",     left:"81%", transform:"translateX(-50%)", height:"200px", zIndex:10 } },
      { src:"/img/home/sobresale-6-3.png", style:{ position:"absolute", top:"-50px", left:"74%", transform:"translateX(-50%)", height:"250px", zIndex:10 } },
    ],
  },
];

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ user, onLogoutClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen]  = useState(false);
  const [ddOpen,   setDdOpen]    = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  const links = [
    { label:"Inicio",           to:"/home" },
    { label:"Semana Santa",     to:"/semana" },
    { label:"Sitios de interés",to:"/hoteles" },
    { label:"Historia",         to:"/historia" },
    { label:"Entretenimiento",  to:"/entretenimiento" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <Link to="/home"><img src="/img/home/logo.png" alt="Logo" /></Link>
      </div>

      <ul className="nav-links">
        {links.map(l => <li key={l.label}><Link to={l.to}>{l.label}</Link></li>)}
      </ul>

      <div className="nav-actions">
        {user ? (
          <div style={{ position:"relative" }} ref={ddRef}>
            <div className="profile-avatar" onClick={(e) => { e.stopPropagation(); setDdOpen(v => !v); }}>
              <img src={user.imagen_perfil || "https://res.cloudinary.com/de7ob8hb2/image/upload/v1768505287/avatar_naranja_ofufi8.png"} alt="Perfil" />
            </div>
            {ddOpen && (
              <div className="dropdown-menu">
                {user.rol === "empresario"    && <Link to="/redirect-by-role"><i className="fas fa-briefcase" /> Panel Empresarial</Link>}
                {user.rol === "administrador" && <Link to="/dashboard-administrador"><i className="fas fa-tachometer-alt" /> Dashboard Admin</Link>}
                <Link to="/perfil"><i className="fas fa-user-edit" /> Editar Perfil</Link>
                <button onClick={() => { setDdOpen(false); onLogoutClick(); }}><i className="fas fa-sign-out-alt" /> Cerrar Sesión</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="icon-login"><i className="fas fa-user" /></Link>
        )}
        <button className="hamburger-btn" onClick={() => setMenuOpen(v => !v)}>
          <i className="fas fa-bars" />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>)}
        </div>
      )}
    </nav>
  );
}

// ── MODAL LOGOUT ──────────────────────────────────────────────────────────────
function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3>Cerrar Sesión</h3>
        <p>¿Estás seguro de que deseas cerrar sesión?</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-logout" onClick={onConfirm}><i className="fas fa-sign-out-alt" /> Sí, Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setCurrent(c => (c + 1) % SLIDER_IMAGES.length), 6000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="hero">
      {SLIDER_IMAGES.map((src, i) => (
        <div key={i} className="hero-slide" style={{ backgroundImage:`url(${src})`, opacity: i === current ? 1 : 0 }}>
          <div className="overlay" />
        </div>
      ))}
      <div className="hero-content">
        <div className="hero-welcome">
          <span>BIENVENIDO A</span>
          <div className="hero-line" />
        </div>
        <h1 className="hero-title">Popayán</h1>
        <div className="hero-location">
          <i className="fa-solid fa-location-dot" />
          <span>Cauca, Colombia</span>
        </div>
      </div>
    </div>
  );
}

// ── CARDS DESCUBRE ────────────────────────────────────────────────────────────
function CardsDescubre() {
  return (
    <section className="descubre">
      <h2 className="descubre-titulo">Descubre la Ciudad Blanca</h2>
      <div className="cards-grid">
        {CARDS.map((card, i) => (
          <div key={i} className="card-item">
            {/* Espacio reservado para la imagen flotante que sobresale hacia arriba */}
            <div className="card-flotante-area">
              <div className="card-fondo">
                <img className="fondo" src={card.fondo} alt="" />
                <img
                  className="flotante"
                  src={card.flotante}
                  alt=""
                  style={{
                    top: card.top,
                    left: card.left || "50%",
                    transform: "translateX(-50%)",
                    height: card.h,
                  }}
                />
                {card.extras?.map((ex, j) => <img key={j} src={ex.src} alt="" style={ex.style} />)}
              </div>
            </div>
            <div className="card-body">
              <h3>{card.titulo}</h3>
              <p>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── GALERÍA TÍTULO ────────────────────────────────────────────────────────────
function GaleriaTitulo() {
  return (
    <section className="galeria-titulo" style={{ backgroundImage:"url('/img/barra-lateral-2.png')" }}>
      <h2>Galería de Imágenes</h2>
    </section>
  );
}

// ── CARRUSEL INFINITO ─────────────────────────────────────────────────────────
function InfiniteCarrusel({ images, direction="left", height=300 }) {
  const tripled  = [...images, ...images, ...images];
  const animName = direction === "left" ? "scrollLeft" : "scrollRight";
  return (
    <div className="carrusel-wrap" style={{ height }}>
      <div className="carrusel-track" style={{ animation:`${animName} 40s linear infinite` }}>
        {tripled.map((img, i) => (
          <div key={i} className="carrusel-slide" style={{ width:img.w, height }}>
            <img src={img.src} alt="" style={{ width:img.w, height }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NOTICIAS ──────────────────────────────────────────────────────────────────
function Noticias() {
  const secundarias = [
    { img:"/img/home/noticias/noticas-2.png", fecha:"4–7 Sep, 2025",    titulo:"Semana santa de Popayán 2025" },
    { img:"/img/home/noticias/noticias-3.png",fecha:"10 Ene, 2025",     titulo:"Carnaval de pubenza" },
    { img:"/img/home/noticias/noticias-5.png",fecha:"13–20 Abr, 2025",  titulo:"Festival de música religiosa" },
    { img:"/img/home/noticias/noticias-6.png",fecha:"Nov, 2025",        titulo:"Noche de museos" },
  ];
  return (
    <section className="noticias">
      <h2>Noticias y Eventos</h2>
      <div className="noticias-grid">

        {/* Principal */}
        <div className="card-principal">
          <div className="img-noticia" style={{ backgroundImage:"url('/img/home/noticias/congresoG1.png')" }} />
          <div className="texto">
            <p className="fecha">4–7 de Septiembre, 2025</p>
            <h3>Festival gastronómico de Popayán 2025</h3>
            <p className="descripcion">Saborea Colombia en la ciudad reconocida por la UNESCO como ciudad creativa de la gastronomía...</p>
          </div>
        </div>

        {/* Larga 2 */}
        <div className="card-larga2">
          <div className="contenido">
            <p className="fecha2">Diciembre, 2025</p>
            <h4>Dia de la pendecina</h4>
            <Link to="/noticia" className="flecha-link">→</Link>
          </div>
          <div className="imagen" style={{ backgroundImage:"url('/img/home/noticias/noticias-7.png')" }} />
        </div>

        {/* Derecha */}
        <div className="noticias-derecha">
          {secundarias.map((n, i) => (
            <div key={i} className="card-sec" style={{ backgroundImage:`url('${n.img}')` }}>
              <div className="ov" />
              <div className="info">
                <p className="fecha">{n.fecha}</p>
                <h4>{n.titulo}</h4>
                <Link to="/noticia" className="flecha">→</Link>
              </div>
            </div>
          ))}
          <div className="card-larga-h">
            <div className="contenido">
              <p className="fecha">Diciembre, 2025</p>
              <h4>Festival artesanal manos de oro</h4>
              <Link to="/noticia" className="flecha-link">→</Link>
            </div>
            <div className="imagen" style={{ backgroundImage:"url('/img/home/noticias/noticias-4.png')" }} />
          </div>
        </div>

      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo-wrap">
          <div className="footer-logo-line" />
          <div className="footer-logo-circle">
            <img src="/img/home/logo_blanco.png" alt="Logo" />
          </div>
        </div>
        <div className="footer-grid">
          <div className="footer-section">
            <h3>Acerca de</h3>
            <ul>
              <li><a href="#">¿Quiénes somos?</a></li>
              <li><Link to="/terminos">Términos y condiciones</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contacto</h3>
            <ul>
              <li>Correo:<br />popayanalltour</li>
              <li>Línea gratuita:<br />312 231 1230</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Redes Sociales</h3>
            <ul>
              {[
                { icon:"fab fa-instagram", text:"@PopayanAllTour",      href:"https://www.instagram.com/popayanalltour/" },
                { icon:"fab fa-facebook",  text:"Popayan AllTour",      href:"https://www.facebook.com/profile.php?id=61578069024241" },
                { icon:"fab fa-youtube",   text:"@popayanAlltour5002",  href:"#" },
              ].map((s,i) => (
                <li key={i} className="social-item">
                  <i className={s.icon} /><a href={s.href}>{s.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© PopayanAllTour | Todos los derechos reservados</div>
      </div>
    </footer>
  );
}

// ── HOME (página principal) ───────────────────────────────────────────────────
export default function Home() {
  const [user,        setUser]        = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/usuarios/me/", { withCredentials:true })
      .then(res => setUser(res.data))
      .catch(()  => setUser(null));
  }, []);

  const handleLogout = async () => {
    try { await axios.post("/api/auth/logout/", {}, { withCredentials:true }); } catch (_) {}
    setUser(null); setLogoutModal(false); navigate("/login");
  };

  return (
    <>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.4.0/css/all.css" />
      <Navbar user={user} onLogoutClick={() => setLogoutModal(true)} />
      <LogoutModal open={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={handleLogout} />
      <Hero />
      <CardsDescubre />
      <GaleriaTitulo />
      <InfiniteCarrusel images={CARRUSEL_1} direction="left"  height={300} />
      <InfiniteCarrusel images={CARRUSEL_2} direction="right" height={300} />
      <InfiniteCarrusel images={CARRUSEL_3} direction="left"  height={300} />
      <InfiniteCarrusel images={CARRUSEL_4} direction="left"  height={300} />
      <div style={{ backgroundColor:"black", height:50 }} />
      <Noticias />
      <Footer />
    </>
  );
}