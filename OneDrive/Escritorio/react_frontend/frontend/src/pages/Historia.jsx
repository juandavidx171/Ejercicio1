import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Historia.css";

// ============================================================
// DATOS CENTRALIZADOS — equivalente al data_por_ano de views.py
// ============================================================
const HISTORIA = {
  1537: {
    ano: 1537,
    titulo: "Fundación de Popayán",
    contenido: [
      "Fundada el 13 de enero de 1537 por el conquistador español Sebastián de Belalcázar, su ubicación estratégica entre Quito y Cartagena la convirtió en un punto clave para las rutas comerciales y militares del virreinato. Desde sus inicios, Popayán destacó por su organización administrativa, su influencia eclesiástica y su papel en la expansión de la corona española en América del Sur. Durante el periodo colonial, la ciudad se consolidó como un centro político, religioso y cultural. La llegada de órdenes religiosas como los franciscanos, dominicos y jesuitas permitió la construcción de iglesias, colegios y seminarios, lo que convirtió a Popayán en un bastión del catolicismo y la educación en el Nuevo Reino de Granada.",
      "Figuras como el propio Belalcázar y otros encomenderos jugaron un rol determinante en el establecimiento del poder colonial, mientras que los pueblos indígenas locales, como los pubenenses, resistieron valientemente antes de ser sometidos a un nuevo orden social. La fundación de Popayán sentó las bases para el desarrollo del suroccidente colombiano y su historia permanece como un testimonio clave del proceso de conquista y colonización en América.",
    ],
    imagenes: { left: "/img-historia/1537_left.webp", right: "/img-historia/1537_right.webp" },
    imagenClaseLeft: "img-izquierda",
    imagenClaseDerecha: "img-derecha",
    personajes: [
      {
        nombre: "Sebastián de Belalcázar",
        fecha: "1479–1551",
        img_fondo: "/img-historia/fondo_1.webp",
        img_sobre: "/img-historia/sobre_1.webp",
        descripcion: "Fue el fundador de Popayán en 1537. Como conquistador español, estableció rutas estratégicas entre Quito y Cartagena, lo que consolidó la presencia española en el suroccidente colombiano.",
      },
      {
        nombre: "Juan de Ampudia",
        fecha: "1479–1541",
        img_fondo: "/img-historia/fondo_2.webp",
        img_sobre: "/img-historia/sobre_2.webp",
        descripcion: "Era uno de los capitanes de Belalcázar, participando activamente en la fundación de varias ciudades. Su papel militar fue esencial para controlar la región y someter a las comunidades indígenas.",
      },
      {
        nombre: "Lorenzo de Aldana",
        fecha: "1508–1571",
        img_fondo: "/img-historia/fondo_3.webp",
        img_sobre: "/img-historia/sobre_3.webp",
        descripcion: "Ejerciendo el cargo de gobernador interino tras Belalcázar, su administración ayudó a organizar el sistema colonial local y consolidar el poder español en la zona.",
      },
    ],
    datos_curiosos: [
      "El nombre Popayán proviene del cacique indígena Payán, señor del valle donde se asentaron los españoles",
      "La ciudad fue fundada tres veces: primero en Roldanillo, luego en El Tambo, y finalmente en su ubicación actual.",
      "Popayán fue originalmente pensada como un punto intermedio entre Quito y Cartagena, lo que le dio gran valor estratégico",
      "En sus primeros años, el oro de los ríos del Cauca era lavado por indígenas bajo el sistema de encomienda.",
    ],
  },

  1601: {
    ano: 1601,
    titulo: "Consolidación de la iglesia",
    contenido: [
      "Esta etapa, marcada por la institucionalización de la Iglesia Católica en la ciudad, estuvo caracterizada por una intensa actividad misionera, educativa y arquitectónica que definió su identidad religiosa y cultural. La fundación de la diócesis de Popayán en 1546 por el papa Paulo III, con la designación de fray Juan del Valle como su primer obispo, marcó el inicio de un proceso de organización eclesiástica que se afianzó en las décadas posteriores. Desde entonces, obispos, frailes y misioneros trabajaron activamente en la evangelización de la población indígena, la edificación de templos y conventos, y la estructuración de un modelo social basado en la moral católica.",
      "Uno de los acontecimientos clave fue la llegada y expansión de distintas órdenes religiosas. Los franciscanos fueron los primeros en establecerse, seguidos por los dominicos, quienes fundaron el convento de Santo Domingo, y más adelante los jesuitas, que construyeron colegios donde se impartía educación en gramática, latín, teología y filosofía. La Iglesia, además, adquirió grandes extensiones de tierra y riquezas a través de donaciones y herencias, lo que le permitió ejercer una influencia política significativa en la región.",
    ],
    imagenes: { right: "/img-historia/anio_1601/1601.webp" },
    imagenClaseDerecha: "img-derecha_1601",
    personajes: [
      {
        nombre: "Fray Alonso de Zamora",
        fecha: "1635–1717 (Aproximación)",
        img_fondo: "/img-historia/anio_1601/fondo_1.png",
        img_sobre: "/img-historia/anio_1601/sobre_1.png",
        descripcion: "Se data de él como uno de los primeros frailes dominicos que ayudó a establecer el poder de la Iglesia en Popayán, además de promover la evangelización de los indígenas.",
      },
      {
        nombre: "Juan del Valle",
        fecha: "1500–1563",
        img_fondo: "/img-historia/anio_1601/fondo_2.png",
        img_sobre: "/img-historia/anio_1601/sobre_2.png",
        descripcion: "Fue el primer obispo de Popayán (1546), y aunque anterior a 1601, su legado perduró al estructurar la diócesis y sentar bases para la educación religiosa.",
      },
    ],
    datos_curiosos: [
      "Fue una de las primeras ciudades con una diócesis propia en el Nuevo Reino de Granada, desde 1546.",
      "Los franciscanos, dominicos y jesuitas compitieron por construir las iglesias más suntuosas, muchas de las cuales aún existen.",
      "En esa época, los misioneros viajaban hasta el Amazonas desde Popayán para evangelizar pueblos indígenas.",
      "Algunas familias criollas donaban grandes fortunas a la Iglesia para asegurar prestigio y poder local.",
    ],
  },

  1701: {
    ano: 1701,
    titulo: "Auge económico y minero",
    contenido: [
      "Popayán vivió un periodo de gran esplendor económico durante el siglo XVIII, consolidándose como uno de los centros más importantes del Virreinato gracias a la minería de oro y al comercio. Su ubicación estratégica en la ruta entre Quito y Cartagena favoreció el tránsito de mercancías, metales preciosos y viajeros, convirtiéndola en un eje clave del suroccidente del virreinato. Las élites criollas, enriquecidas por la minería en Barbacoas y el Chocó, construyeron fastuosas casonas, templos y capillas, que aún hoy conservan el estilo colonial característico de la ciudad.",
      "Este auge económico permitió el desarrollo de una vida cultural y social sofisticada. Las familias aristocráticas promovieron la educación y el arte, y su influencia se hizo sentir en todos los ámbitos de la vida colonial. Aunque profundamente desigual, esta etapa marcó el crecimiento urbano de Popayán, sentando las bases de su arquitectura, su patrimonio y su posición como símbolo de poder y tradición en el suroccidente colombiano.",
    ],
    imagenes: { left: "/img-historia/anio_1701/1701_e.webp", right: "/img-historia/anio_1701/1701_right.webp" },
    imagenClaseLeft: "img-izquierda_1701",
    imagenClaseDerecha: "img-derecha_1701",
    personajes: [
      {
        nombre: "Antonio de la Torre y Miranda",
        fecha: "1734–1805",
        img_fondo: "/img-historia/anio_1701/fondo_1.webp",
        img_sobre: "/img-historia/anio_1701/sobre_1.webp",
        descripcion: "Fue un encomendero y empresario criollo destacado que impulsó la minería en la región del Cauca, enriqueciendo a la élite local.",
      },
      {
        nombre: "Francisco Antonio de Arboleda Salazar",
        fecha: "1732–1793",
        img_fondo: "/img-historia/anio_1701/fondo_2.png",
        img_sobre: "/img-historia/anio_1701/sobre_2.png",
        descripcion: "Fue un hacendado, militar y político neogranadino influyente de una familia poderosa de Popayán. Participó en la política colonial el cuál consolidó el poder de las élites criollas.",
      },
      {
        nombre: "José Ignacio de Pombo",
        fecha: "1761–1812",
        img_fondo: "/img-historia/anio_1701/fondo_3.png",
        img_sobre: "/img-historia/anio_1701/sobre_3.png",
        descripcion: "Comerciante y político que pertenecía a una de las familias fundadoras. Su actividad económica fortaleció la ciudad como centro minero.",
      },
    ],
    datos_curiosos: [
      "La ciudad fue escenario de tensiones entre realistas y patriotas, con figuras como Camilo Torres y José María Obando.",
      "Muchos próceres y líderes de la independencia nacieron o estudiaron en Popayán, como Francisco José de Caldas.",
      "La élite tradicionalmente apoyaba al rey, sin embargo, con estos sucesos apoyó a la causa libertadora.",
      "La ciudad sufrió saqueos y represalias en las guerras de independencia.",
    ],
  },

  1801: {
    ano: 1801,
    titulo: "Popayán en la independencia",
    contenido: [
      "En esta ciudad nacieron figuras históricas de gran trascendencia, como Camilo Torres, sacerdote y líder revolucionario, y Francisco José de Caldas, científico, ingeniero y patriota. Ambos fueron esenciales en la lucha por la libertad y participaron activamente en los eventos que marcaron la independencia del país. El fervor patriótico que caracterizó a los habitantes de Popayán impulsó numerosas acciones para lograr la separación de España.",
      "Uno de los momentos más críticos ocurrió en 1820, cuando Simón Bolívar envió al general José María Obando a liberar el Cauca. La ciudad fue nuevamente disputada en sangrientos combates, y Popayán, dividida entre partidarios del rey y defensores de la república, sufrió saqueos, incendios y profundas fracturas sociales. Los ideales de libertad germinaron con fuerza en sus claustros, colegios y tertulias intelectuales, y su legado sigue siendo un pilar fundamental en la historia de la independencia de Colombia.",
    ],
    imagenes: { left: "/img-historia/anio_1801/1801_left.webp", right: "/img-historia/anio_1801/1801_right.webp" },
    imagenClaseLeft: "img-izquierda_1801",
    imagenClaseDerecha: "img-derecha_1801",
    personajes: [
      {
        nombre: "Simón Bolivar",
        fecha: "1783–1830",
        img_fondo: "/img-historia/anio_1801/fondo_1.webp",
        img_sobre: "/img-historia/anio_1801/sobre_1.webp",
        descripcion: "Simón Bolívar fue clave en la independencia de Colombia, liderando batallas como la de Boyacá en 1819. Su lucha y visión por una América Latina unida lo convirtieron en el principal impulsor de la libertad en la región.",
      },
      {
        nombre: "Antonio Nariño",
        fecha: "1765–1823",
        img_fondo: "/img-historia/anio_1801/fondo_2.webp",
        img_sobre: "/img-historia/anio_1801/sobre_2.webp",
        descripcion: 'Conocido como "El Precursor", tradujo y difundió los derechos del hombre, promoviendo ideas republicanas y de libertad. Su valentía y compromiso lo llevaron a ser uno de los primeros en enfrentar el dominio español en el país.',
      },
      {
        nombre: "Tomás Cipriano de Mosquera",
        fecha: "1798–1878",
        img_fondo: "/img-historia/anio_1801/fondo_3.webp",
        img_sobre: "/img-historia/anio_1801/sobre_3.webp",
        descripcion: "Líder de importantes reformas como la abolición de los diezmos y la desamortización de bienes eclesiásticos, promovió la modernización del Estado y la defensa de la soberanía nacional.",
      },
    ],
    datos_curiosos: [
      "La ciudad fue escenario de tensiones entre realistas y patriotas, con figuras como Camilo Torres y José María Obando.",
      "Muchos próceres y líderes de la independencia nacieron o estudiaron en Popayán, como Francisco José de Caldas.",
      "La élite tradicionalmente apoyaba al rey, sin embargo, con estos sucesos apoyó a la causa libertadora.",
      "La ciudad sufrió saqueos y represalias en las guerras de independencia.",
    ],
  },

  1831: {
    ano: 1831,
    titulo: "Fin de la Gran Colombia",
    contenido: [
      "Para Popayán, una ciudad con fuerte tradición política y conservadora, representó un momento de gran agitación ya que había sido centro del poder colonial y que, tras la independencia, se encontró en medio de profundas transformaciones políticas. La disolución de la Gran Colombia, el ambicioso proyecto integracionista de Simón Bolívar, trajo consigo una ruptura en el orden político que afectó directamente la estructura territorial y el rol que Popayán había desempeñado hasta entonces.",
      "En las calles de Popayán, el pueblo vivía con incertidumbre. El final del proyecto de la Gran Colombia no solo implicaba un nuevo mapa político, sino también una reorganización de los impuestos, la justicia, el comercio y las lealtades militares. La ciudad mantenía su arquitectura colonial y su estructura social jerárquica, pero ya se vislumbraban los conflictos que marcarían el siglo XIX.",
    ],
    imagenes: {},
    personajes: [
      {
        nombre: "José Hilario López",
        fecha: "1798–1869",
        img_fondo: "/img-historia/anio_1831/fondo_1.webp",
        img_sobre: "/img-historia/anio_1831/sobre_1.webp",
        descripcion: "Nacido en Popayán en 1798, fue presidente de Colombia y líder liberal. Como presidente, abolió la esclavitud en 1851. Promovió reformas agrarias y educativas. Representó la transición del poder desde Popayán hacia un Estado más moderno.",
      },
      {
        nombre: "Julio Arboleda Pombo",
        fecha: "1817–1862",
        img_fondo: "/img-historia/anio_1831/fondo_2.webp",
        img_sobre: "/img-historia/anio_1831/sobre_2.webp",
        descripcion: "Poeta, político y militar conservador nacido en 1817 en Popayán. Defensor del orden tradicional, fue presidente del Estado Soberano del Cauca. Su obra literaria y liderazgo político influyeron en la identidad regional.",
      },
      {
        nombre: "Manuel María Mosquera y Arboleda",
        fecha: "1800–1882",
        img_fondo: "/img-historia/anio_1831/fondo_3.webp",
        img_sobre: "/img-historia/anio_1831/sobre_3.webp",
        descripcion: "Fue diplomático, político y arzobispo destacado en el siglo XIX colombiano. Perteneció a una de las familias más influyentes de la época y fue designado Arzobispo de Bogotá en 1859.",
      },
    ],
    datos_curiosos: [
      "Con la disolución de la Gran Colombia, Popayán pasó a ser parte del Estado Soberano del Cauca, uno de los más grandes.",
      "El Estado del Cauca tenía tanto poder que llegó a tener su propia constitución y ejército.",
    ],
  },

  1885: {
    ano: 1885,
    titulo: "Guerra civil y la centralización del poder",
    contenido: [
      "La guerra civil de 1885 surgió como reacción a las reformas liberales y al federalismo que habían dominado décadas anteriores. Las élites de Popayán, ligadas fuertemente a la Iglesia y al poder conservador, se resistieron a la pérdida de influencia que trajo consigo el modelo federalista. Durante el conflicto, la ciudad fue escenario de movilizaciones armadas, enfrentamientos y profundas divisiones internas.",
      "Tras la victoria del bando conservador, se impuso una nueva constitución en 1886, que eliminó los Estados Soberanos y fortaleció el poder central en Bogotá. Con ello, Popayán perdió parte de su autonomía política, pero conservó su relevancia cultural y religiosa. El clero, las familias influyentes y las instituciones educativas reforzaron su papel en la formación de las nuevas generaciones bajo los valores del orden conservador.",
    ],
    imagenes: { left: "/img-historia/anio_1885/1885_a.webp", right: "/img-historia/anio_1885/1885_e.webp" },
    imagenClaseLeft: "img-izquierda_1885",
    imagenClaseDerecha: "img-derecha_1855",
    personajes: [
      {
        nombre: "Miguel Arroyo Hurtado",
        fecha: "1838–1890",
        img_fondo: "/img-historia/anio_1885/fondo_1.webp",
        img_sobre: "/img-historia/anio_1885/sobre_1.webp",
        descripcion: "Participó en la guerra civil de 1885 como líder de fuerzas conservadoras en el Cauca. Tras el conflicto, ocupó cargos regionales en representación del nuevo gobierno central.",
      },
      {
        nombre: "José María Quijano Wallis",
        fecha: "1870–1923",
        img_fondo: "/img-historia/anio_1885/fondo_2.webp",
        img_sobre: "/img-historia/anio_1885/sobre_2.webp",
        descripcion: "Representó el pensamiento conservador tradicionalista y fue cercano a las posturas que apoyaban la centralización. Su influencia fue notable en los debates legales y constitucionales que siguieron a la guerra civil.",
      },
      {
        nombre: "Manuel Antonio Arboleda Scarpetta",
        fecha: "1847–1922",
        img_fondo: "/img-historia/anio_1885/fondo_3.webp",
        img_sobre: "/img-historia/anio_1885/sobre_3.webp",
        descripcion: "Ejerció como rector de la Universidad del Cauca y participó activamente en la vida intelectual de la ciudad. Durante la guerra civil de 1885, defendió abiertamente la causa centralista y conservadora.",
      },
    ],
    datos_curiosos: [
      "El conflicto provocó el cierre temporal de escuelas y seminarios, pero la Iglesia los retomó rápidamente.",
      "Muchos patojos ricos estudiaban en Europa, pero regresaban para reforzar el modelo colonialista local.",
      "Durante esta época surgieron publicaciones políticas y literarias en Popayán que promovían ideales católicos y orden social.",
    ],
  },

  1937: {
    ano: 1937,
    titulo: "Celebración del IV Centenario",
    contenido: [
      "La celebración del IV Centenario impulsó la recuperación y embellecimiento del centro histórico, reafirmando a Popayán como una de las joyas patrimoniales de Colombia. Se restauraron edificios coloniales, se levantaron monumentos conmemorativos y se promovieron publicaciones académicas que recogieron su historia. Además, este aniversario consolidó el papel de la ciudad como bastión conservador y centro espiritual del suroccidente colombiano.",
      "Más allá de la festividad, el IV Centenario se convirtió en un símbolo de continuidad entre el pasado y el presente, resaltando la riqueza cultural de Popayán y su vocación intelectual. Fue también una oportunidad para proyectar la ciudad hacia el futuro, celebrando no solo lo que había sido, sino lo que aspiraba a seguir siendo: un referente de tradición, belleza arquitectónica y conciencia histórica.",
    ],
    imagenes: { left: "/img-historia/anio_1937/1937_dere.webp", right: "/img-historia/anio_1937/1937_dere_2.webp" },
    imagenClaseLeft: "img-izquierda_1937",
    imagenClaseDerecha: "img-derecha_1937",
    personajes: [
      {
        nombre: "Guillermo Valencia",
        fecha: "1873–1943",
        img_fondo: "/img-historia/anio_1937/fondo_1.webp",
        img_sobre: "/img-historia/anio_1937/sobre_1.webp",
        descripcion: "Su presencia y obra reforzaron el aura intelectual y conservadora de Popayán durante las celebraciones. Era considerado símbolo del refinamiento literario y de la tradición patricia de la ciudad.",
      },
      {
        nombre: "Rafael Maya",
        fecha: "1897–1980",
        img_fondo: "/img-historia/anio_1937/fondo_2.webp",
        img_sobre: "/img-historia/anio_1937/sobre_2.webp",
        descripcion: "Participó en la vida cultural de la ciudad en los años 30, y su obra periodística e intelectual se alineaba con el espíritu de exaltación patrimonial e histórica que marcó la conmemoración.",
      },
      {
        nombre: "Carlos Albán",
        fecha: "1888–1947",
        img_fondo: "/img-historia/anio_1937/fondo_3.webp",
        img_sobre: "/img-historia/anio_1937/sobre_3.webp",
        descripcion: "Fue parte del movimiento que promovió investigaciones y publicaciones sobre la historia de la ciudad para conmemorar sus 400 años. Su trabajo ayudó a consolidar la memoria histórica que se destacó en las celebraciones.",
      },
    ],
    datos_curiosos: [
      "Se construyó el puente del Humilladero, símbolo arquitectónico de la ciudad, para conectar la ciudad alta con la baja.",
      "Durante la conmemoración se revivieron costumbres coloniales como los bailes de salón y vestimenta de época.",
      "Guillermo Valencia, además de poeta, fue embajador y candidato presidencial, y su casa hoy es museo histórico.",
      "Popayán era vista como una ciudad de élite, donde pocas familias concentraban poder político y cultural.",
    ],
  },

  1983: {
    ano: 1983,
    titulo: "Terremoto del 31 de marzo",
    contenido: [
      "El terremoto del 31 de marzo de 1983 marcó un antes y un después en la historia de Popayán, dejando una huella profunda tanto en su arquitectura como en la memoria colectiva de sus habitantes. Aquel Jueves Santo, cuando la ciudad se preparaba para una de las celebraciones religiosas más emblemáticas del país, un sismo de magnitud 5.5 sacudió su territorio con una fuerza inesperada. En pocos segundos, gran parte del centro histórico quedó reducido a escombros.",
      "El impacto humano fue igualmente devastador: centenares de muertos, miles de heridos y un número significativo de damnificados que perdieron no solo sus hogares, sino también su tranquilidad y seguridad. Gracias al espíritu colectivo, Popayán logró recuperar buena parte de su arquitectura tradicional, convirtiéndose en un símbolo de resiliencia urbana y patrimonial.",
    ],
    imagenes: { right: "/img-historia/anio_1983/1983.webp" },
    imagenClaseDerecha: "img-derecha_1983",
    personajes: [
      {
        nombre: "Gustavo Wilches-Chaux",
        fecha: "1954–Actualidad",
        img_fondo: "/img-historia/anio_1983/fondo_1.webp",
        img_sobre: "/img-historia/anio_1983/sobre_1.webp",
        descripcion: "Fue uno de los primeros en reflexionar profundamente sobre el concepto de gestión del riesgo a partir de la experiencia del terremoto de 1983. Su pensamiento influyó en políticas de prevención y manejo de desastres a nivel nacional.",
      },
      {
        nombre: "Rafael Maya",
        fecha: "1897–1980",
        img_fondo: "/img-historia/anio_1983/fondo_2.webp",
        img_sobre: "/img-historia/anio_1983/sobre_2.webp",
        descripcion: "Participó en la vida cultural de la ciudad en los años 30, y su obra periodística e intelectual se alineaba con el espíritu de exaltación patrimonial e histórica que marcó la conmemoración.",
      },
    ],
    datos_curiosos: [
      "El terremoto ocurrió el Jueves Santo, interrumpiendo por primera vez en siglos las procesiones de Semana Santa.",
      "Arquitectos de todo el país se unieron a la reconstrucción con técnicas coloniales tradicionales.",
      "Se destruyó más del 80% del centro histórico, incluyendo iglesias coloniales y casas patrimoniales.",
      "A raíz del desastre, Popayán desarrolló uno de los planes de restauración patrimonial más ambiciosos de Colombia.",
    ],
  },
};

// Grupos de años para la línea de tiempo (igual que el template Django)
const GRUPOS_TIMELINE = [
  [1537, 1601, 1701, 1801, 1831],
  [1831, 1885, 1937, 1983, 2005],
];

const ANOS = Object.keys(HISTORIA).map(Number);

// ============================================================
// COMPONENT PRINCIPAL
// ============================================================
export default function Historia() {
  const { ano: anoParam } = useParams();
  const navigate = useNavigate();

  const [anoActivo, setAnoActivo] = useState(
    anoParam ? parseInt(anoParam) : 1537
  );
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const datos = HISTORIA[anoActivo] || HISTORIA[1537];

  // Qué grupo de años mostrar en el timeline
  const grupoTimeline =
    anoActivo <= 1831 ? GRUPOS_TIMELINE[0] : GRUPOS_TIMELINE[1];

  // Año anterior y siguiente para las flechas
  const idxActual = ANOS.indexOf(anoActivo);
  const anoPrev = idxActual > 0 ? ANOS[idxActual - 1] : null;
  const anoNext = idxActual < ANOS.length - 1 ? ANOS[idxActual + 1] : null;

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
      if (!e.target.closest(".hi-user-menu")) setDropdownOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── Cambiar de año con transición ──
  const cambiarAno = (ano) => {
    if (ano === anoActivo) return;
    setTransitioning(true);
    setTimeout(() => {
      setAnoActivo(ano);
      navigate(`/historia/${ano}`);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout/", {}, { withCredentials: true });
      window.location.href = "/login/";
    } catch {
      window.location.href = "/login/";
    }
  };

  return (
    <div className="hi-page">
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className={`hi-navbar${navScrolled ? " scrolled" : ""}`}>
        <Link to="/" className="hi-logo-nav">
          <img src="/img/home/logo.png" alt="Popayán Tour Logo" />
        </Link>

        <ul className={`hi-nav-menu${menuOpen ? " active" : ""}`} id="hi-nav-menu">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/semana-santa" onClick={() => setMenuOpen(false)}>Semana Santa</Link></li>
          <li><Link to="/sitios-de-interes" onClick={() => setMenuOpen(false)}>Sitios de interés</Link></li>
          <li><Link to="/historia" onClick={() => setMenuOpen(false)}>Historia</Link></li>
          <li><Link to="/entretenimiento" onClick={() => setMenuOpen(false)}>Entretenimiento</Link></li>
        </ul>

        <div className="hi-nav-actions">
          <div className="hi-nav-icons">
            {user ? (
              <div className="hi-user-menu">
                <div
                  className="hi-profile-avatar"
                  onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                  title="Menú de usuario"
                >
                  <img src={user.imagen_perfil || "/img/default-avatar.png"} alt="Perfil" />
                </div>
                {dropdownOpen && (
                  <div className="hi-dropdown">
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
              <Link to="/login" className="hi-nav-icon" title="Iniciar sesión">
                <i className="fas fa-user"></i>
              </Link>
            )}
          </div>
          <div
            className={`hi-hamburger${menuOpen ? " active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </div>
      </nav>

      {/* ═══════════════ MODAL LOGOUT ═══════════════ */}
      {logoutModal && (
        <div className="hi-modal-overlay" onClick={() => setLogoutModal(false)}>
          <div className="hi-modal" onClick={(e) => e.stopPropagation()}>
            <span className="hi-modal-close" onClick={() => setLogoutModal(false)}>&times;</span>
            <h3>Cerrar Sesión</h3>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="hi-modal-actions">
              <button className="hi-btn-cancel" onClick={() => setLogoutModal(false)}>Cancelar</button>
              <button className="hi-btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Sí, Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SECCIÓN HERO - AÑO GIGANTE ═══════════════ */}
      <section className={`hi-historia-section${transitioning ? " transitioning" : ""}`}>
        <h2 className="hi-subtitulo">ANTECEDENTES DESDE:</h2>

        <div className="hi-ano">{datos.ano}</div>

        {/* Imágenes superpuestas — clases CSS del original preservadas */}
        {datos.imagenes?.left && (
          <img
            src={datos.imagenes.left}
            alt="Imagen histórica"
            className={`hi-hist-img ${datos.imagenClaseLeft || "img-izquierda"}`}
          />
        )}
        {datos.imagenes?.right && (
          <img
            src={datos.imagenes.right}
            alt="Imagen histórica"
            className={`hi-hist-img ${datos.imagenClaseDerecha || "img-derecha"}`}
          />
        )}

        {/* ── Timeline ── */}
        <div className="hi-timeline">
          <ul>
            {grupoTimeline.map((ano, idx) => {
              const isActive = ano === anoActivo;
              const isClickable = ANOS.includes(ano);
              return (
                <li key={ano}>
                  {isActive ? (
                    <>
                      <span className="dot active"></span>
                      <span className="year active">{ano}</span>
                    </>
                  ) : (
                    <>
                      <span className="dot-va"></span>
                      <span className="dot-va2"></span>
                      <span
                        className={`year_a${isClickable ? " clickable" : ""}`}
                        onClick={() => isClickable && cambiarAno(ano)}
                        style={{ cursor: isClickable ? "pointer" : "default" }}
                      >
                        {ano}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ═══════════════ DETALLE / CONTENIDO ═══════════════ */}
      <section className="hi-detalle">
        {/* Flechas navegación */}
        <div className="hi-flechas">
          <button
            className="hi-flecha"
            onClick={() => anoPrev && cambiarAno(anoPrev)}
            disabled={!anoPrev}
          >
            ⬅
          </button>
          <button
            className="hi-flecha"
            onClick={() => anoNext && cambiarAno(anoNext)}
            disabled={!anoNext}
          >
            ➡
          </button>
        </div>

        <div className="hi-bg"></div>
        <div className={`hi-contenido${transitioning ? " fade-out" : " fade-in"}`}>
          <h2>{datos.titulo}</h2>
          {datos.contenido.map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </div>
      </section>

      {/* ═══════════════ PERSONAJES DESTACADOS ═══════════════ */}
      {datos.personajes?.length > 0 && (
        <section className="hi-personajes">
          <h2 className="hi-titulo-personajes">
            <span></span>
            Personajes Destacados
            <span></span>
          </h2>

          {datos.personajes.map((p, idx) => {
            // Equivalente a {% cycle 'derecha' 'izquierda' %} de Django
            const orientacion = idx % 2 === 0 ? "derecha" : "izquierda";
            // Equivalente a img-fondo{{ forloop.counter }} — número base según año activo
            const grupoIdx = ANOS.indexOf(anoActivo);
            const fondoClass = `img-fondo${grupoIdx + 1}${idx + 1}`;
            const sobreClass = `img-sobre${grupoIdx + 1}${idx + 1}`;

            return (
              <div key={idx} className={`hi-personaje-card ${orientacion}`}>
                <div className="hi-personaje-imagen">
                  <img className={fondoClass} src={p.img_fondo} alt="Fondo" />
                  <img className={sobreClass} src={p.img_sobre} alt={p.nombre} />
                </div>
                <div className="hi-personaje-info">
                  <span className="hi-personaje-fecha">{p.fecha}</span>
                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* ═══════════════ DATOS CURIOSOS ═══════════════ */}
      {datos.datos_curiosos?.length > 0 && (
        <section className="hi-datos-curiosos">
          <h2 className="hi-datos-titulo">
            <span></span> Datos Curiosos <span></span>
          </h2>
          <div className="hi-datos-grid">
            {datos.datos_curiosos.map((dato, i) => (
              <div key={i} className="hi-dato-card">
                <p>{dato}</p>
                <img src="/img-historia/datos.png" alt="Decoración" className="hi-decoracion-card" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="hi-footer">
        <div className="hi-footer-content">
          <div className="hi-logo-section">
            <div className="hi-logo-footer">
              <img src="/img/home/logo_blanco.png" alt="Logo Popayán Tour" />
            </div>
            <div className="hi-linea-horizontal"></div>
          </div>

          <div className="hi-footer-grid">
            <div className="hi-footer-section">
              <h3>Acerca de</h3>
              <ul>
                <li><a href="#">¿Quiénes somos?</a></li>
                <li><Link to="/terminos">Términos y condiciones</Link></li>
              </ul>
            </div>
            <div className="hi-footer-section">
              <h3>Contacto</h3>
              <ul>
                <li>Correo: <br />popayanalltour</li>
                <li>Línea gratuita: <br /> 312 231 1230</li>
              </ul>
            </div>
            <div className="hi-footer-section">
              <h3>Redes Sociales</h3>
              <ul className="hi-social-icons">
                <li><i className="fab fa-instagram"></i><a href="https://www.instagram.com/popayanalltour/">@PopayanAllTour</a></li>
                <li><i className="fab fa-facebook"></i><a href="https://www.facebook.com/profile.php?id=61578069024241">Popayan AllTour</a></li>
                <li><i className="fab fa-youtube"></i> @popayanAlltour5002</li>
              </ul>
            </div>
          </div>

          <div className="hi-footer-bottom">
            <p>&copy; PopayanAllTour | Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}