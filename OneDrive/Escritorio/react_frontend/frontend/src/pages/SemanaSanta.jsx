import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SemanaSanta.css";

// ── DATOS ────────────────────────────────────────────────────────────────────
const PROCESIONES = [
  { day:"lunes",    img:"/img/img_se/Lunes.jpg",       titulo:"Lunes Santo",        hora:"8:00 PM", desc:"Misa del Carguero",                                                   href:"/procesiones/#lunes",    featured:false },
  { day:"martes",   img:"/img/img_se/martes_1.jpg",    titulo:"Martes Santo",       hora:"8:00 PM", desc:"Procesión del Señor del Perdón y María Santísima de los Dolores",     href:"/procesiones/",          featured:false },
  { day:"miercoles",img:"/img/img_se/miercoles_1.jpg", titulo:"Miércoles Santo",    hora:"8:00 PM", desc:"Procesión del Amo Jesús y la Virgen Dolorosa",                        href:"/procesiones/#miercoles",featured:false },
  { day:"jueves",   img:"/img/img_se/jueves_1.jpg",    titulo:"Jueves Santo",       hora:"8:00 PM", desc:"Procesión de la Pasión y Muerte de Nuestro Señor",                    href:"/procesiones/#jueves",   featured:false },
  { day:"viernes",  img:"/img/img_se/viernes_2.jpg",   titulo:"Viernes Santo",      hora:"8:00 PM", desc:"Procesión del Santo Entierro de Cristo - La más solemne y concurrida", href:"/procesiones/#viernes",  featured:true  },
  { day:"sabado",   img:"/img/img_se/sabado_1.jpg",    titulo:"Sábado Santo",       hora:"8:00 PM", desc:"Procesión de la Soledad de María",                                    href:"/procesiones/#sabado",   featured:false },
  { day:"domingo",  img:"/img/img_se/domingo.jpg",     titulo:"Domingo de Ramos",   hora:"8:00 PM", desc:"Procesión de la Soledad de María",                                    href:"/procesiones/#domingo",  featured:false },
];

const HISTORIA_SLIDES = [
  { year:"1537", titulo:"1537 - Fundación de Popayán",       desc:"Según el presbítero e historiador Manuel A. Bueno, la primera vez que se dio culto a Dios fue el 15 de agosto de 1537, día de La Asunción a pocos meses de la fundación de Popayán.",                                                                                                                      img:"/img/img_se/decoracion_7.jpg",  modal:"fundacion" },
  { year:"1556", titulo:"1556 - Inicio de las Procesiones",  desc:"Las Procesiones de Semana Santa de Popayán inician en el año 1556, como muestra religiosa en conmemoración de la pasión, muerte y resurrección de Jesús. Una de las primeras referencias la hizo Juan de Castellanos en sus Elegías de varones ilustres de Indias.",                                        img:"/img/img_se/decoracion_8.jpg",  modal:"procesiones" },
  { year:"1826", titulo:"1826 - Procesión en Honor a Bolívar",desc:"Cuando Simón Bolívar regresaba triunfante después de la batalla de Ayacucho en la última semana de octubre de 1826, en Popayán organizaron en su honor una procesión semejante a las de Semana Santa.",                                                                                                     img:"/img/img_se/decoracion_9.jpg",  modal:"bolivar" },
  { year:"1840", titulo:"1840 - Los Supremos Participan",    desc:"El 14 de abril de 1840, José María Obando y Juan Gregorio Sarria, conocidos como los \"supremos\", dejan sus armas durante la Semana Santa para participar en la procesión del martes santo vestidos de cargueros al estilo sevillano.",                                                                      img:"/img/img_se/decoracion_10.jpg", modal:"supremos" },
  { year:"1859", titulo:"1859 - Descripción de Vergara",     desc:"El cronista José María Vergara y Vergara en uno de sus escritos del año 1859 describió la Semana mayor de Popayán como un acto solemne e importante para el pueblo payanés que cada año lo recibía con fervor y fe.",                                                                                        img:"/img/img_se/decoracion_11.jpg", modal:"vergara" },
  { year:"1983", titulo:"1983 - El Terremoto",               desc:"El 31 de marzo de 1983, Jueves Santo, Popayán fue sacudida por un terremoto que destruyó el centro histórico y mató a más de 300 personas. En más de 450 años no se había presenciado una suspensión de las procesiones payanesas.",                                                                         img:"/img/img_se/decoracion_12.jpg", modal:"terremoto" },
  { year:"2009", titulo:"2009 - Declaración UNESCO",         desc:"Las procesiones de Semana Santa de Popayán fueron declaradas Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO, reconociendo una tradición que había sido celebrada desde la época colonial.",                                                                                                      img:"/img/img_se/decoracion_13.jpg", modal:"unesco" },
  { year:"2020", titulo:"2020-2021 - Pandemia COVID-19",     desc:"En los años 2020 y 2021, se suspenden nuevamente los desfiles procesionales debido a la pandemia mundial por COVID-19, siendo la segunda vez en la historia que se suspendían las procesiones después del terremoto de 1983.",                                                                                  img:"/img/img_se/decoracion_14.jpg", modal:"pandemia" },
];

const GALERIA = [
  { src:"/img/img_se/viernes_1.jpg",    caption:"Procesión del Viernes Santo", tipo:"large" },
  { src:"/img/img_se/decoracion_2.jpg", caption:"Cargueros Tradicionales",     tipo:"" },
  { src:"/img/img_se/decoracion_3.jpg", caption:"Pasos Procesionales",         tipo:"" },
  { src:"/img/img_se/decoracion_4.jpeg",caption:"Calles de Popayán",           tipo:"tall" },
  { src:"/img/img_se/decoracion_5.jpg", caption:"Incienso y Tradición",        tipo:"" },
  { src:"/img/img_se/decoracion_6.jpg", caption:"Multitud de Fieles",          tipo:"wide" },
  { src:"/img/img_se/semanaSanta.jpg",  caption:"Incienso y Tradición",        tipo:"" },
];

const MODAL_DATA = {
  fundacion:  { icon:"⛪", titulo:"1537 - Fundación de Popayán",        body:`<div class="ss-modal-col"><h3>Los Primeros Días</h3><p><span class="ss-highlight">15 de agosto de 1537</span> — Día de La Asunción: Primera vez que se dio culto a Dios en la recién fundada ciudad de Popayán, según documenta el presbítero e historiador Manuel A. Bueno.</p><h3 style="margin-top:1rem">Contexto Histórico</h3><ul class="ss-modal-list"><li>Popayán fue fundada por Sebastián de Belalcázar</li><li>Ubicada estratégicamente en el Valle de Pubenza</li><li>Centro de poder colonial en el sur del Virreinato</li><li>Los primeros templos se construyeron de inmediato</li></ul></div><div class="ss-modal-col"><h3>Importancia Religiosa</h3><p>Desde sus primeros meses, Popayán se estableció como un centro de profunda religiosidad, sentando las bases para lo que siglos después se convertiría en una de las tradiciones más importantes de América Latina.</p></div>` },
  procesiones:{ icon:"🚶", titulo:"1556 - Inicio de las Procesiones",   body:`<div class="ss-modal-col"><h3>El Comienzo de una Tradición</h3><p><span class="ss-highlight">Año 1556</span> — Las Procesiones de Semana Santa de Popayán inician como muestra religiosa en conmemoración de la pasión, muerte y resurrección de Jesús.</p></div>` },
  bolivar:    { icon:"⚔️", titulo:"1826 - Procesión en Honor a Bolívar", body:`<div class="ss-modal-col"><h3>El Libertador en Popayán</h3><p><span class="ss-highlight">Última semana de octubre de 1826</span> — Simón Bolívar regresa triunfante después de la batalla de Ayacucho y Popayán lo recibe con una procesión especial.</p></div>` },
  supremos:   { icon:"⚔️", titulo:"1840 - Los Supremos Participan",     body:`<div class="ss-modal-col"><h3>Un Momento Histórico</h3><p><span class="ss-highlight">14 de abril de 1840</span> — José María Obando y Juan Gregorio Sarria participan en la procesión como cargueros al estilo sevillano.</p></div>` },
  vergara:    { icon:"📖", titulo:"1859 - Crónica de Vergara y Vergara", body:`<div class="ss-modal-col"><h3>El Cronista</h3><p><span class="ss-highlight">Año 1859</span> — José María Vergara y Vergara describe la Semana Santa de Popayán como un acto solemne e importante para el pueblo payanés.</p></div>` },
  terremoto:  { icon:"🌍", titulo:"1983 - El Terremoto",                 body:`<div class="ss-modal-col"><h3>El Día que Todo Cambió</h3><p><span class="ss-highlight">31 de marzo de 1983 — Jueves Santo</span> — Un devastador terremoto destruyó el centro histórico y obligó a suspender las procesiones por primera vez en más de 450 años.</p></div>` },
  unesco:     { icon:"🏆", titulo:"2009 - Declaración UNESCO",           body:`<div class="ss-modal-col"><h3>Reconocimiento Mundial</h3><p><span class="ss-highlight">2009</span> — Las procesiones de Semana Santa de Popayán son declaradas Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO.</p></div>` },
  pandemia:   { icon:"🦠", titulo:"2020-2021 - Pandemia COVID-19",       body:`<div class="ss-modal-col"><h3>Segunda Suspensión Histórica</h3><p><span class="ss-highlight">2020 y 2021</span> — La pandemia por COVID-19 obliga a suspender las procesiones por segunda vez en la historia, después del terremoto de 1983.</p></div>` },
};

// ── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ user, onLogoutClick }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [ddOpen,    setDdOpen]    = useState(false);
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
    { label:"Inicio",            to:"/home" },
    { label:"Semana Santa",      to:"/semana" },
    { label:"Sitios de interés", to:"/hoteles" },
    { label:"Historia",          to:"/historia" },
    { label:"Entretenimiento",   to:"/entretenimiento" },
  ];

  return (
    <nav className={`ss-navbar ${scrolled ? "scrolled" : ""}`}>
      <Link to="/home" className="ss-logo-nav">
        <img src="/img/home/logo.png" alt="Logo" />
      </Link>

      <ul className="ss-nav-menu" style={{ display: menuOpen ? "flex" : "" }}>
        {links.map(l => <li key={l.label}><Link to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link></li>)}
      </ul>

      <div className="ss-nav-actions">
        {user ? (
          <div style={{ position:"relative" }} ref={ddRef}>
            <div className="ss-profile-avatar" onClick={(e) => { e.stopPropagation(); setDdOpen(v => !v); }}>
              <img src={user.imagen_perfil || "https://res.cloudinary.com/de7ob8hb2/image/upload/v1768505287/avatar_naranja_ofufi8.png"} alt="Perfil" />
            </div>
            {ddOpen && (
              <div className="ss-dropdown-menu">
                {user.rol === "empresario"    && <Link to="/redirect-by-role"><i className="fas fa-briefcase" /> Panel Empresarial</Link>}
                {user.rol === "administrador" && <Link to="/dashboard-administrador"><i className="fas fa-tachometer-alt" /> Dashboard Admin</Link>}
                <Link to="/perfil"><i className="fas fa-user-edit" /> Editar Perfil</Link>
                <button onClick={() => { setDdOpen(false); onLogoutClick(); }}><i className="fas fa-sign-out-alt" /> Cerrar Sesión</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="ss-icon-login"><i className="fas fa-user" /></Link>
        )}
        <button className="ss-hamburger-btn" onClick={() => setMenuOpen(v => !v)}>
          <i className="fas fa-bars" />
        </button>
      </div>
    </nav>
  );
}

// ── MODAL LOGOUT ─────────────────────────────────────────────────────────────
function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="ss-logout-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ss-logout-box">
        <button className="ss-logout-close" onClick={onClose}>&times;</button>
        <h3>Cerrar Sesión</h3>
        <p>¿Estás seguro de que deseas cerrar sesión?</p>
        <div className="ss-logout-actions">
          <button className="ss-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="ss-btn-confirm" onClick={onConfirm}><i className="fas fa-sign-out-alt" /> Sí, Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };
  return (
    <section className="ss-hero" id="inicio">
      <div className="ss-hero-overlay" />
      <div className="ss-hero-content">
        <span className="ss-hero-subtitle">PATRIMONIO CULTURAL DE LA HUMANIDAD</span>
        <h2 className="ss-hero-title">
          <span className="ss-title-line">SEMANA</span>
          <span className="ss-title-line">SANTA</span>
          <span className="ss-title-accent">POPAYÁN</span>
        </h2>
        <p className="ss-hero-desc">Vive la tradición más antigua de Colombia. Más de 450 años de historia, fe y cultura.</p>
        <div className="ss-hero-buttons">
          <button className="ss-btn-primary" onClick={() => scrollTo("procesiones")}>Explorar Procesiones</button>
          <button className="ss-btn-secondary" onClick={() => scrollTo("historia")}>Nuestra Historia</button>
        </div>
      </div>
      <div className="ss-hero-scroll">
        <div className="ss-scroll-arrow" />
      </div>
    </section>
  );
}

// ── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <section className="ss-about">
      <div className="ss-container">
        <div className="ss-about-grid">
          <div className="ss-about-content">
            <span className="ss-section-label">Historia y Tradición</span>
            <h2 className="ss-section-title">450 Años de Fe</h2>
            <p className="ss-about-text">Desde 1566, las calles empedradas de Popayán se transforman cada Semana Santa en un escenario sagrado donde la fe, el arte y la tradición se entrelazan en procesiones nocturnas que han cautivado a generaciones.</p>
            <p className="ss-about-text">Declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO, nuestra Semana Santa es una experiencia única que combina el fervor religioso con la riqueza cultural del Cauca.</p>
            <div className="ss-stats-grid">
              {[
                { num:"450+",  label:"Años de tradición",    id:"historia" },
                { num:"5",     label:"Procesiones nocturnas", id:"procesiones" },
                { num:"100K+", label:"Visitantes anuales",   id:"informacion" },
              ].map(s => (
                <div key={s.num} className="ss-stat-item" onClick={() => scrollTo(s.id)}>
                  <span className="ss-stat-number">{s.num}</span>
                  <span className="ss-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ss-about-image">
            <div className="ss-image-frame">
              <img src="/img/img_se/decoracion_1.jpg" alt="Procesión histórica" className="ss-frame-img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PROCESIONES ──────────────────────────────────────────────────────────────
function Procesiones() {
  return (
    <section className="ss-procesiones" id="procesiones">
      <div className="ss-container">
        <div className="ss-section-header">
          <span className="ss-section-label">Recorridos Sagrados</span>
          <h2 className="ss-section-title">Procesiones Nocturnas</h2>
        </div>
        <div className="ss-procesiones-grid">
          {PROCESIONES.map(p => (
            <div key={p.day} className={`ss-card ${p.featured ? "featured" : ""}`}>
              <div className="ss-card-img">
                <img src={p.img} alt={p.titulo} />
              </div>
              <div className="ss-card-body">
                <h3>{p.titulo}</h3>
                <p className="ss-card-time">{p.hora}</p>
                <p className="ss-card-desc">{p.desc}</p>
                <Link to={p.href} className="ss-card-link">Ver Recorrido →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CARRUSEL HISTORIA ────────────────────────────────────────────────────────
function CarruselHistoria({ onOpenModal }) {
  const [current, setCurrent] = useState(0);
  const total = HISTORIA_SLIDES.length;
  const intervalRef = useRef(null);

  const startAuto = () => {
    intervalRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 6000);
  };
  const stopAuto  = () => clearInterval(intervalRef.current);

  useEffect(() => { startAuto(); return stopAuto; }, []);

  const go = (idx) => {
    const n = (idx + total) % total;
    setCurrent(n);
    stopAuto(); startAuto();
  };

  const slide = HISTORIA_SLIDES[current];

  return (
    <>
      <h2 className="ss-historia-title">Historia</h2>
      <div className="ss-carousel" id="historia" onMouseEnter={stopAuto} onMouseLeave={startAuto}>
        <div className="ss-carousel-wrapper">
          <div className="ss-carousel-text">
            <h2>{slide.titulo}</h2>
            <p>{slide.desc}</p>
            <button className="ss-cta-btn" onClick={() => onOpenModal(slide.modal)}>Ver historia completa</button>
          </div>
          <div className="ss-carousel-img">
            <img src={slide.img} alt={slide.titulo} className="ss-team-img" />
          </div>
        </div>

        <button className="ss-carousel-nav prev" onClick={() => go(current - 1)}>‹</button>
        <button className="ss-carousel-nav next" onClick={() => go(current + 1)}>›</button>

        <div className="ss-carousel-dots">
          {HISTORIA_SLIDES.map((_, i) => (
            <span key={i} className={`ss-dot ${i === current ? "active" : ""}`} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </>
  );
}

// ── MODAL HISTORIA ───────────────────────────────────────────────────────────
function ModalHistoria({ tipo, onClose }) {
  if (!tipo) return null;
  const data = MODAL_DATA[tipo];
  if (!data) return null;
  return (
    <div className="ss-history-modal active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ss-modal-content">
        <button className="ss-modal-close" onClick={onClose}>&times;</button>
        <div className="ss-modal-header">
          <span className="ss-modal-icon">{data.icon}</span>
          <h2 className="ss-modal-title">{data.titulo}</h2>
        </div>
        <div className="ss-modal-body" dangerouslySetInnerHTML={{ __html: data.body }} />
      </div>
    </div>
  );
}

// ── GALERÍA ──────────────────────────────────────────────────────────────────
function Galeria() {
  return (
    <section className="ss-gallery" id="galeria">
      <div className="ss-gallery-header">
        <span className="ss-section-label">Momentos Únicos</span>
        <h2 className="ss-section-title">Galería Fotográfica</h2>
      </div>
      <div className="ss-gallery-grid">
        {GALERIA.map((g, i) => (
          <div key={i} className={`ss-gallery-item ${g.tipo}`}>
            <img src={g.src} alt={g.caption} />
            <div className="ss-gallery-overlay">
              <span className="ss-gallery-caption">{g.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── INFO ─────────────────────────────────────────────────────────────────────
function Info() {
  return (
    <section className="ss-info" id="informacion">
      <div className="ss-container">
        <div className="ss-section-header">
          <span className="ss-section-label">Planifica tu Visita</span>
          <h2 className="ss-section-title">Guía del Visitante</h2>
        </div>
        <div className="ss-info-grid">

          {/* Cómo llegar */}
          <div className="ss-info-card">
            <div className="ss-info-icon-wrap"><span>📍</span></div>
            <h3>Cómo Llegar</h3>
            <p className="ss-info-intro">Popayán, conocida como la Ciudad Blanca, está ubicada en el suroccidente colombiano. Su centro histórico es el escenario de las procesiones.</p>
            <div className="ss-info-details">
              {[
                { label:"Vía Aérea",     val:"Aeropuerto Guillermo León Valencia, conectado con Bogotá, Cali y Medellín. 20 minutos al centro histórico." },
                { label:"Vía Terrestre", val:"Terminal de Transportes a 10 minutos del centro. Conexiones frecuentes desde Cali (2h), Pasto (4h) y Bogotá (12h)." },
                { label:"En la Ciudad",  val:"El centro histórico es completamente peatonal durante Semana Santa. Se recomienda caminar o usar transporte público." },
              ].map(d => (
                <div key={d.label} className="ss-info-detail"><strong>{d.label}</strong><span>{d.val}</span></div>
              ))}
            </div>
            <div className="ss-info-highlight">
              <strong>Recorrido Procesional</strong>
              <span>Inicia en el Templo de San Francisco (Carrera 9 con Calle 4) y recorre las principales calles del centro.</span>
            </div>
          </div>

          {/* Calendario */}
          <div className="ss-info-card">
            <div className="ss-info-icon-wrap"><span>📅</span></div>
            <h3>Calendario 2025</h3>
            <p className="ss-info-intro">Las procesiones se realizan durante toda la Semana Santa, cada noche a las 8:00 PM en punto. La puntualidad es una tradición inquebrantable de 500 años.</p>
            <div className="ss-info-details">
              {[
                { label:"Domingo de Ramos", val:"13 de Abril - Procesión de la Entrada Triunfal a Jerusalén" },
                { label:"Martes Santo",     val:"15 de Abril - Procesión de Nuestro Señor Jesucristo" },
                { label:"Miércoles Santo",  val:"16 de Abril - Procesión del Señor de la Veracruz" },
                { label:"Jueves Santo",     val:"17 de Abril - Procesión del Amo Jesús Nazareno (la más concurrida)" },
                { label:"Viernes Santo",    val:"18 de Abril - Procesión del Santo Entierro de Cristo (la más solemne)" },
                { label:"Sábado Santo",     val:"19 de Abril - Procesión de Nuestra Señora de los Dolores" },
              ].map(d => (
                <div key={d.label} className="ss-info-detail"><strong>{d.label}</strong><span>{d.val}</span></div>
              ))}
            </div>
            <div className="ss-info-highlight">
              <strong>Duración</strong>
              <span>Cada procesión dura entre 3 y 4 horas. El clima es frío (12-16°C) por las noches.</span>
            </div>
          </div>

          {/* Consejos */}
          <div className="ss-info-card">
            <div className="ss-info-icon-wrap"><span>💡</span></div>
            <h3>Consejos Esenciales</h3>
            <p className="ss-info-intro">Para vivir esta experiencia única con comodidad y respeto, ten en cuenta estas recomendaciones de visitantes experimentados y organizadores.</p>
            <ul className="ss-info-list">
              <li><strong>Hospedaje:</strong> Reserva con 4-6 meses de anticipación. Los hoteles del centro se agotan rápidamente.</li>
              <li><strong>Vestimenta:</strong> Ropa oscura y respetuosa (negro, azul oscuro, gris). Evita colores brillantes.</li>
              <li><strong>Clima:</strong> Las noches son frías (12-16°C). Lleva ropa abrigada, impermeable y calzado cómodo.</li>
              <li><strong>Llegada:</strong> Llega al menos 2 horas antes para conseguir buen lugar en la ruta procesional.</li>
              <li><strong>Respeto:</strong> Guarda silencio durante el paso de las imágenes. Apaga el flash de la cámara.</li>
              <li><strong>Seguridad:</strong> Cuida tus pertenencias en las multitudes. Lleva solo lo necesario.</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="ss-footer">
      <div className="ss-footer-inner">
        <div className="ss-footer-logo-wrap">
          <div className="ss-footer-logo-line" />
          <div className="ss-footer-logo-circle">
            <img src="/img/home/logo_blanco.png" alt="Logo" />
          </div>
        </div>
        <div className="ss-footer-grid">
          <div className="ss-footer-section">
            <h3>Acerca de</h3>
            <ul>
              <li><a href="#">¿Quiénes somos?</a></li>
              <li><Link to="/terminos">Términos y condiciones</Link></li>
            </ul>
          </div>
          <div className="ss-footer-section">
            <h3>Contacto</h3>
            <ul>
              <li>Correo:<br />popayanalltour</li>
              <li>Línea gratuita:<br />312 231 1230</li>
            </ul>
          </div>
          <div className="ss-footer-section">
            <h3>Redes Sociales</h3>
            <ul>
              {[
                { icon:"fab fa-instagram", text:"@PopayanAllTour",     href:"https://www.instagram.com/popayanalltour/" },
                { icon:"fab fa-facebook",  text:"Popayan AllTour",     href:"https://www.facebook.com/profile.php?id=61578069024241" },
                { icon:"fab fa-youtube",   text:"@popayanAlltour5002", href:"#" },
              ].map((s,i) => (
                <li key={i} className="ss-social-item">
                  <i className={s.icon} /><a href={s.href}>{s.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ss-footer-bottom">© PopayanAllTour | Todos los derechos reservados</div>
      </div>
    </footer>
  );
}

// ── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function SemanaSanta() {
  const [user,        setUser]        = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [modalTipo,   setModalTipo]   = useState(null);
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
      <About />
      <Procesiones />
      <CarruselHistoria onOpenModal={setModalTipo} />
      <ModalHistoria tipo={modalTipo} onClose={() => setModalTipo(null)} />
      <Galeria />
      <Info />
      <Footer />
    </>
  );
}