import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Procesiones.css";

// ══════════════════════════════════════════════════════════════
// PASOS REUTILIZABLES (equivalente a las variables en views.py)
// ══════════════════════════════════════════════════════════════
const BASE = {
  san_juan:     { img:"/img/img_se/pasos_24.png",  titulo:"San Juan Evangelista",    cargueros:"12 hombres", peso:"320 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de San Juan Evangelista es uno de los más elegantes y armoniosos, se compone de una anda de madera finamente tallada, adornada con detalles dorados, flores blancas y candelabros que iluminan su recorrido nocturno. Su diseño busca reflejar serenidad y pureza, en coherencia con el papel de San Juan como discípulo fiel." },
  magdalena:    { img:"/img/img_se/pasos_1.png",   titulo:"La Magdalena",            cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada",            desc:"Representa a María Magdalena, seguidora fiel de Jesús. La imagen la muestra en actitud de recogimiento, con expresión de dolor y penitencia. Es una talla colonial de gran belleza, que resalta la devoción femenina en la Pasión." },
  veronica:     { img:"/img/img_se/pasos_2.png",   titulo:"La Verónica",             cargueros:"12 hombres", peso:"350 kg aprox.", material:"Madera tallada y tela natural", desc:"Paso que representa el momento en que Verónica limpia el rostro de Cristo camino al Calvario. La tradición asegura que la tela conservó la Santa Faz. La imagen transmite ternura y valentía femenina frente al sufrimiento." },
  huerto:       { img:"/img/img_se/pasos_3.jpg",   titulo:"El Señor del Huerto",     cargueros:"16 hombres", peso:"600 kg aprox.", material:"Madera policromada",            desc:"Evoca a Cristo en oración en el Monte de los Olivos, momento previo a la Pasión. Su expresión refleja entrega y resignación. Es una de las tallas más antiguas de la procesión, símbolo de recogimiento espiritual." },
  prendimiento: { img:"/img/img_se/pasos_4.jpg",   titulo:"El Prendimiento",         cargueros:"20 hombres", peso:"700 kg aprox.", material:"Madera policromada",            desc:"Escena que muestra la captura de Jesús por los soldados romanos en presencia de Judas Iscariote. Destaca por la fuerza dramática de sus figuras y el realismo en los gestos." },
  negacion:     { img:"/img/img_se/pasos_25.jpg",  titulo:"La Negación",             cargueros:"12 hombres", peso:"340 kg aprox.", material:"Madera tallada y policromada", desc:"Representa el momento en que el apóstol Pedro niega conocer a Jesús antes del canto del gallo, cumpliéndose las palabras del Maestro. El paso muestra una composición escénica en la que Pedro, rodeado por soldados y una criada, refleja el miedo y la debilidad humana frente a la fe." },
  azotes:       { img:"/img/img_se/pasos_26.jpg",  titulo:"Los Azotes",              cargueros:"12 hombres", peso:"350 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de Los Azotes representa el momento en que Jesús es flagelado por los soldados romanos antes de ser condenado a muerte. Es una de las escenas más impactantes, pues simboliza el sufrimiento, la humillación y la fortaleza de Cristo frente al dolor." },
  caido:        { img:"/img/img_se/pasos_26.jpg",  titulo:"El Señor Caído",          cargueros:"20 hombres", peso:"650 kg aprox.", material:"Madera policromada",            desc:"Figura de Cristo desplomado bajo el peso de la cruz, con rostro de sufrimiento y compasión. Es uno de los pasos más venerados y despierta profunda devoción en los fieles." },
  ecce:         { img:"/img/img_se/pasos_27.jpg",  titulo:"Ecce Homo",               cargueros:"12 hombres", peso:"340 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de Ecce Homo representa el instante en que Pilato presenta a Jesús ante el pueblo, después de haber sido azotado y coronado de espinas, diciendo: \"Ecce Homo\" (He aquí el hombre). Es una de las escenas más solemnes y simbólicas de la procesión." },
  encuentro:    { img:"/img/img_se/pasos_28.jpg",  titulo:"El Encuentro",            cargueros:"12 hombres", peso:"350 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de El Encuentro representa el conmovedor momento en que Jesús, cargando la cruz camino al Calvario, se encuentra con su Madre, la Virgen María. Es una de las escenas más humanas y profundas, pues simboliza el dolor compartido entre madre e hijo." },
  amo:          { img:"/img/img_se/pasos_29.png",  titulo:"El Amo Jesús",            cargueros:"12 hombres", peso:"360 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de El Amo Jesús representa a Cristo en su camino hacia el Calvario, cargando la cruz con resignación y dignidad. Es una de las imágenes más queridas y veneradas por los payaneses, considerada símbolo de protección, fe y esperanza para la ciudad." },
  perdon:       { img:"/img/img_se/pasos_30.jpg",  titulo:"El Señor del Perdón",     cargueros:"12 hombres", peso:"340 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de El Señor del Perdón representa a Jesús mostrando misericordia y compasión hacia la humanidad, incluso en medio de su sufrimiento. Su expresión serena y su mirada hacia el cielo reflejan la grandeza del perdón divino." },
  crucifijo:    { img:"/img/img_se/pasos_33.png",  titulo:"El Crucifijo",            cargueros:"12 hombres", peso:"350 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de El Crucifijo representa el momento central de la Pasión: Jesús ya clavado en la cruz, consumando su sacrificio redentor por la humanidad. Es uno de los pasos más antiguos y respetados, símbolo de muerte, redención y esperanza eterna." },
  dolorosa:     { img:"/img/img_se/pasos_38.jpg",  titulo:"La Dolorosa",             cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada",            desc:"Simboliza el profundo sufrimiento de la Virgen María ante la Pasión y muerte de su Hijo. Es un paso que expresa el dolor maternal, la fortaleza y la fe inquebrantable." },
  sentencia:    { img:"/img/img_se/pasos_40.png",  titulo:"La Sentencia",            cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada",            desc:"Representa el momento en que Jesús es condenado a muerte por Poncio Pilato. Este paso simboliza la injusticia y la fragilidad del juicio humano frente a la verdad." },
};

// Helper: crea un paso a partir de una base, con número y overrides opcionales
const p = (base, numero, overrides = {}) => ({ ...BASE[base], numero, ...overrides });

// ══════════════════════════════════════════════════════════════
// DATOS DE PROCESIONES
// ══════════════════════════════════════════════════════════════
const PROCESIONES = {
  lunes: {
    titulo:"Lunes Santo", subtitulo:"Misa del Carguero",
    horario:"8:00 PM - 1:00 AM", num_pasos:"11 Pasos Procesionales", cargueros_totales:240,
    desc1:"El Lunes Santo en Popayán representa principalmente la solemnidad por la institución de la Sagrada Eucaristía, que es el acto central en la Última Cena donde Jesucristo entrega su cuerpo y sangre a sus apóstoles como sacrificio y comunión espiritual.",
    desc2:"Esta celebración es una manifestación de fe enfocada en la memoria histórica y espiritual del sacrificio de Cristo, símbolo de unidad y devoción comunitaria, cultivada en Popayán desde el siglo XVI como una tradición religiosa y cultural.",
    desc3:"Además, el Lunes Santo simboliza la recuperación de una tradición perdida por más de un siglo, restituida en 2017 por la Junta Procesional con apoyo de la Alcaldía y la Universidad del Cauca.",
    pasos:[
      { numero:1, img:"/img/img_se/pasos_59.jpg", titulo:"Jesucristo en la Última Cena", cargueros:"15 hombres", peso:"320 kg aprox.", material:"Madera policromada", desc:"Escultura central que representa el momento eucarístico donde Jesús instituye la comunión con los apóstoles, simbolizando sacrificio y unidad." },
      { numero:2, img:"/img/img_se/pasos_60.jpg", titulo:"Jesucristo en la Última Cena", cargueros:"15 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Escultura central que representa el momento eucarístico donde Jesús instituye la comunión con los apóstoles, simbolizando sacrificio y unidad." },
      p("magdalena",3), p("veronica",4), p("huerto",5),
      p("prendimiento",6), p("negacion",7), p("sentencia",8),
      p("azotes",9), p("caido",10), p("ecce",11),
    ],
  },

  martes: {
    titulo:"Martes Santo", subtitulo:"Procesión del Señor del Perdón y María Santísima de los Dolores",
    horario:"8:00 PM - 11:30 PM", num_pasos:"16 Pasos Procesionales", cargueros_totales:224,
    kilometros:2.8, horas:3.5, calles:12,
    mapa:"https://www.google.com/maps/embed?pb=!1m34!1m12!1m3!1d3986.1917699962496!2d-76.61088362527605!3d2.4430976570875163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m19!3e0!4m5!1s0x8e300310438eaac9%3A0x473fe8cc717e420f!2sIglesia%20de%20San%20Francisco%2C%20Cra.%209%20%234-29%2C%20Centro%2C%20Popay%C3%A1n%2C%20Cauca!3m2!1d2.4433751!2d-76.6085971!4m5!1s0x8e300305549d061f%3A0xbf6f7babea98c6c4!2sCatedral%20Nuestra%20Se%C3%B1ora%20de%20La%20Asunci%C3%B3n%2C%20Cl.%205a%2C%20Centro%2C%20Popay%C3%A1n%2C%20Cauca!3m2!1d2.4412333!2d-76.60656089999999!4m5!1s0x8e300310438eaac9%3A0x473fe8cc717e420f!2sIglesia%20de%20San%20Francisco%2C%20Cra.%209%20%234-29%2C%20Centro%2C%20Popay%C3%A1n%2C%20Cauca!3m2!1d2.4433751!2d-76.6085971!5e0!3m2!1ses-419!2sco!4v1755772269519!5m2!1ses-419!2sco",
    desc1:"El Martes Santo marca el inicio oficial de las grandes procesiones nocturnas de la Semana Santa payanesa. Esta jornada está dedicada a la meditación sobre el perdón divino y el dolor maternal de María.",
    desc2:"Los pasos que conforman esta procesión narran episodios fundamentales de la Pasión: desde la oración en el huerto hasta el encuentro de Jesús con su Madre Dolorosa.",
    desc3:"Esta procesión se caracteriza por su solemnidad y por ser la más íntima de toda la semana, donde la participación ciudadana es masiva pero respetuosa, creando un silencio sagrado que envuelve las calles empedradas de la ciudad blanca.",
    pasos:[
      p("san_juan",1), p("magdalena",2), p("veronica",3), p("huerto",4),
      p("prendimiento",5), p("negacion",6), p("azotes",7), p("caido",8),
      p("ecce",9), p("encuentro",10), p("amo",11), p("perdon",12),
      { numero:13, img:"/img/img_se/pasos_31.jpg", titulo:"El Calvario", cargueros:"12 hombres", peso:"360 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de El Calvario representa el momento culminante del camino de Jesús hacia la crucifixión, cuando llega al monte del Gólgota. Simboliza la culminación del sufrimiento humano y la entrega total de Cristo por la redención del mundo." },
      { numero:14, img:"/img/img_se/pasos_32.png", titulo:"El Cristo de la Sed", cargueros:"12 hombres", peso:"340 kg aprox.", material:"Madera tallada y policromada", desc:"El paso de Cristo de la Sed representa el instante en que Jesús, clavado en la cruz, pronuncia: \"Tengo sed\" (Juan 19:28). Simboliza no solo la sed física sino también la sed espiritual de amor y salvación por la humanidad." },
      p("crucifijo",15),
      { numero:16, img:"/img/img_se/pasos_6.jpeg", titulo:"La Virgen de los Dolores", cargueros:"24 hombres", peso:"700 kg aprox.", material:"Madera tallada y vestidura bordada en oro", desc:"Imagen titular de la procesión, muestra a la Virgen María en profundo dolor al pie de la Cruz. Su rostro refleja tristeza y fortaleza materna. Es el paso más importante del Martes Santo, acompañado con música sacra solemne." },
    ],
    puntos:[
      { titulo:"Salida - Iglesia San Francisco", hora:"8:00 PM",  desc:"Punto de inicio de la procesión. Los pasos salen en orden establecido desde 1566." },
      { titulo:"Calle del Cauca",                hora:"8:30 PM",  desc:"Primera calle principal del recorrido, con balcones coloniales decorados." },
      { titulo:"Plaza Mayor - Catedral",         hora:"9:15 PM",  desc:"Momento más solemne, bendición frente a la Catedral Basílica." },
      { titulo:"Calle Real",                     hora:"10:00 PM", desc:"Tramo con mayor concentración de público y casas coloniales." },
      { titulo:"Regreso - San Francisco",        hora:"11:30 PM", desc:"Finalización de la procesión y recogida de los pasos." },
    ],
  },

  miercoles: {
    titulo:"Miércoles Santo", subtitulo:"Procesión del Amo Jesús y la Virgen Dolorosa",
    horario:"8:00 PM - 12:00 AM", num_pasos:"17 Pasos Procesionales", cargueros_totales:220,
    kilometros:3.5, horas:4.0, calles:16,
    mapa:"https://www.google.com/maps/embed?pb=!1m36!1m12!1m3!1d996.548991797857!2d-76.60628336246064!3d2.4416832717349912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m21!3e2!4m5!1s0x8e30030562103b71%3A0x685cc1b9b802d58!2sClaustro%20De%20Santo%20Domingo%2C%20Centro%2C%20Popay%C3%A1n%2C%20Cauca!3m2!1d2.4417267!2d-76.6047488!4m3!3m2!1d2.4410146!2d-76.60515199999999!4m3!3m2!1d2.4415608!2d-76.6069327!4m5!1s0x8e30030562103b71%3A0x685cc1b9b802d58!2sClaustro%20De%20Santo%20Domingo%2C%20Centro%2C%20Popay%C3%A1n%2C%20Cauca!3m2!1d2.4417267!2d-76.6047488!5e0!3m2!1ses-419!2sco!4v1755772600241!5m2!1ses-419!2sco",
    desc1:"El Miércoles Santo presenta la procesión más emotiva y conmovedora de toda la Semana Santa payanesa. Conocida como la procesión del \"Amo Jesús\", está dedicada a meditar sobre el amor incondicional de Cristo y el encuentro doloroso con su Madre.",
    desc2:"Los pasos que conforman esta procesión narran desde el juicio de Pilatos hasta el calvario del Señor, culminando con el encuentro entre Jesús y María en el camino al Gólgota.",
    desc3:"Esta procesión se caracteriza por la participación masiva de familias enteras que han mantenido viva la tradición durante generaciones.",
    pasos:[
      p("san_juan",1), p("magdalena",2), p("veronica",3),
      { numero:4, img:"/img/img_se/pasos_34.png", titulo:"La Oración", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera tallada y policromada", desc:"Representa el momento de profunda oración de Jesús en Getsemaní, previo a su captura. Simboliza la fortaleza espiritual, la obediencia y la entrega total a la voluntad de Dios." },
      p("prendimiento",5), p("negacion",6), p("azotes",7), p("caido",8),
      p("ecce",9), p("encuentro",10), p("amo",11),
      { numero:12, img:"/img/img_se/pasos_35.jpg", titulo:"El Despojo", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera tallada y policromada", desc:"Representa el momento en que Jesús es despojado de sus vestiduras antes de la crucifixión. Simboliza la humillación y el despojo material, recordando la entrega total de Cristo por la redención del hombre." },
      p("perdon",13),
      { numero:14, img:"/img/img_se/pasos_36.jpg", titulo:"El Cristo de la Sed",   cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera tallada y policromada", desc:"Evoca el instante en que Jesús, ya en la cruz, expresa: \"Tengo sed\". Simboliza el sufrimiento físico de Cristo y su sed espiritual de justicia y salvación." },
      { numero:15, img:"/img/img_se/pasos_37.jpg", titulo:"El Cristo de la Agonía",cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera tallada y policromada", desc:"Representa a Jesús en los últimos momentos de vida en la cruz, cuando el sufrimiento alcanza su punto más profundo. Su mensaje central es la fortaleza espiritual y el amor llevado hasta el extremo." },
      p("crucifijo",16), p("dolorosa",17),
    ],
    puntos:[
      { titulo:"Salida - Iglesia Santo Domingo", hora:"8:00 PM",  desc:"Inicio desde el convento dominico, uno de los más antiguos de la ciudad." },
      { titulo:"Plaza de Caldas",                hora:"8:45 PM",  desc:"Primera parada oficial, bendición especial del Amo Jesús." },
      { titulo:"Calle Larga - Plaza Mayor",      hora:"9:30 PM",  desc:"Momento culminante frente a la Catedral, mayor concentración de fieles." },
      { titulo:"Barrio San Francisco",           hora:"10:15 PM", desc:"Recorrido por las calles más tradicionales del centro histórico." },
      { titulo:"El Callejón del Embudo",         hora:"11:00 PM", desc:"Tramo más estrecho y pintoresco del recorrido." },
      { titulo:"Regreso - Santo Domingo",        hora:"12:00 AM", desc:"Finalización en el punto de origen tras 4 horas de recorrido." },
    ],
  },

  jueves: {
    titulo:"Jueves Santo", subtitulo:"Procesión de la Pasión y Muerte de Nuestro Señor",
    horario:"8:00 PM - 1:00 AM", num_pasos:"17 Pasos Procesionales", cargueros_totales:240,
    kilometros:4.2, horas:5.0, calles:20,
    mapa:"https://www.google.com/maps/embed?pb=!1m38!1m12!1m3!1d3986.194751253035!2d-76.60744512527604!3d2.44209310709254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m23!3e2!4m5!1s0x8e300305bc631871%3A0xeff9e7336c0a4255!2sErmita%20de%20Jes%C3%BAs%20Nazareno%2C%20Cl%205%2C%20Centro%2C%20Popay%C3%A1n%2C%20Cauca!3m2!1d2.4401525!2d-76.6028527!4m5!1s0x8e30033b77c3ec87%3A0x33ee2a06c47a4e76!2sPuente%20Del%20Humilladero!3m2!1d2.444023!2d-76.60508519999999!4m3!3m2!1d2.4415608!2d-76.6069327!4m5!1s0x8e300305bc631871%3A0xeff9e7336c0a4255!2sErmita%20de%20Jes%C3%BAs%20Nazareno!3m2!1d2.4401525!2d-76.6028527!5e0!3m2!1ses-419!2sco!4v1755772716706!5m2!1ses-419!2sco",
    desc1:"El Jueves Santo presenta la procesión más solemne y extensa de toda la Semana Santa payanesa.",
    desc2:"Esta procesión se caracteriza por su duración de cinco horas y por incluir las imágenes más grandes y pesadas de toda la semana.",
    desc3:"El Cristo de la Veracruz, que cierra la procesión, es considerado una de las tallas más perfectas del arte colonial americano.",
    pasos:[
      p("san_juan",1), p("magdalena",2), p("veronica",3), p("huerto",4),
      { numero:5, img:"/img/img_se/pasos_39.png", titulo:"El Beso de Judas", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa el momento en que Judas Iscariote identifica a Jesús ante los soldados mediante un beso. Simboliza la traición, la fragilidad humana y el contraste entre la lealtad y la corrupción moral." },
      p("prendimiento",6), p("sentencia",7), p("azotes",8),
      { numero:9,  img:"/img/img_se/pasos_41.png", titulo:"La Coronación",     cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa el momento en que Jesús es coronado con espinas por los soldados romanos, en un acto de burla y humillación. Resalta la dignidad y fortaleza de Jesús ante el dolor y la burla." },
      p("ecce",10),
      { numero:11, img:"/img/img_se/pasos_42.png", titulo:"La Cruz a Cuestas",  cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa a Jesús avanzando hacia el Calvario mientras carga la cruz. Simboliza el peso del sacrificio, la obediencia y la entrega total por la salvación de la humanidad." },
      p("perdon",12),
      { numero:13, img:"/img/img_se/pasos_44.png", titulo:"La Crucifixión",     cargueros:"24 hombres", peso:"800 kg aprox.", material:"Madera policromada", desc:"Representa el momento central de la Pasión: Jesús clavado en la cruz, acompañado de los dos ladrones y custodiado por soldados romanos." },
      { numero:14, img:"/img/img_se/pasos_43.png", titulo:"El Calvario",        cargueros:"24 hombres", peso:"850 kg aprox.", material:"Madera policromada", desc:"Paso que muestra a Cristo crucificado junto a la Virgen María, San Juan Evangelista y María Magdalena al pie de la cruz." },
      { numero:15, img:"/img/img_se/pasos_13.jpg", titulo:"El Señor de la Expiración", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa el momento en que Jesús entrega su último aliento en la cruz, la culminación del sacrificio redentor y la entrega total." },
      { numero:16, img:"/img/img_se/pasos_45.png", titulo:"El Santo Cristo de la Santa Veracruz", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Presenta a Cristo crucificado bajo la advocación de la Vera Cruz, símbolo de la verdadera cruz donde fue entregada su vida. Representa la solemnidad del sacrificio redentor." },
      p("dolorosa",17),
    ],
    puntos:[
      { titulo:"Salida - Iglesia La Ermita",   hora:"8:00 PM",  desc:"Inicio desde el templo más antiguo, construido en 1546." },
      { titulo:"Puente del Humilladero",        hora:"8:30 PM",  desc:"Cruce simbólico del río Molino, tradición de más de 400 años." },
      { titulo:"Plaza Mayor",                   hora:"10:00 PM", desc:"Momento central de la procesión, mayor solemnidad." },
      { titulo:"Calle del Carozo",              hora:"11:30 PM", desc:"Tramo más empinado, mayor esfuerzo de los cargueros." },
      { titulo:"Regreso - La Ermita",           hora:"1:00 AM",  desc:"Finalización después de 5 horas de recorrido." },
    ],
  },

  viernes: {
    titulo:"Viernes Santo", subtitulo:"Procesión del Santo Entierro",
    horario:"7:00 PM - 11:00 PM", num_pasos:"13 Pasos Procesionales", cargueros_totales:156,
    kilometros:3.0, horas:4.0, calles:14,
    mapa:"https://www.google.com/maps/embed?pb=!1m38!1m12!1m3!1d498.27523958011557!2d-76.60693580989974!3d2.439677001586291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m23!3e2!4m5!1s0x8e30031b48914881%3A0xe36da6139c290913!2sIglesia%20San%20Agust%C3%ADn!3m2!1d2.4394036999999997!2d-76.6068201!4m3!3m2!1d2.4415608!2d-76.6069327!4m5!1s0x8e30030ff9207c27%3A0xf76217f9f8464ebe!2sParque%20Caldas!3m2!1d2.4418674!2d-76.60627389999999!4m5!1s0x8e30031b48914881%3A0xe36da6139c290913!2sIglesia%20San%20Agust%C3%ADn!3m2!1d2.4394036999999997!2d-76.6068201!5e0!3m2!1ses-419!2sco!4v1755772856950!5m2!1ses-419!2sco",
    desc1:"El Viernes Santo representa el momento más solemne y emotivo de toda la Semana Santa payanesa.",
    desc2:"Los pasos que conforman esta procesión narran desde la crucifixión hasta el entierro de Jesús, en la procesión más fúnebre de la semana.",
    desc3:"La procesión del Viernes Santo se distingue por su carácter fúnebre y por la participación de autoridades civiles y militares.",
    pasos:[
      { numero:1,  img:"/img/img_se/pasos_15.jpg",  titulo:"La Muerte",         cargueros:"16 hombres", peso:"500 kg aprox.", material:"Madera policromada", desc:"Representa la figura alegórica de la Muerte, vestida con túnica y portando símbolos fúnebres." },
      { numero:2,  img:"/img/img_se/pasos_16.jpg",  titulo:"María Salomé",      cargueros:"12 hombres", peso:"350 kg aprox.", material:"Madera policromada", desc:"Figura de una de las mujeres que acompañó a Cristo hasta la crucifixión." },
      p("veronica",3), p("magdalena",4),
      { numero:5,  img:"/img/img_se/pasos_47.png",  titulo:"El Varón del Martillo",  cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Figura alegórica de uno de los sayones encargados de ejecutar la crucifixión." },
      { numero:6,  img:"/img/img_se/pasos_46.png",  titulo:"El Varón de las Tenazas",cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa a Jesús en la cruz acompañado de las tenazas utilizadas para retirar los clavos. Invita a la reflexión sobre el dolor y la entrega total manifestada en la crucifixión." },
      { numero:7,  img:"/img/img_se/pasos_19.jpg",  titulo:"El Santo Cristo",    cargueros:"24 hombres", peso:"800 kg aprox.", material:"Madera policromada", desc:"Paso central del Viernes Santo, representa a Jesús ya crucificado." },
      { numero:8,  img:"/img/img_se/pasos_20.png",  titulo:"El Descendimiento",  cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa el momento en que Cristo es bajado de la cruz, asistido por José de Arimatea y Nicodemo." },
      { numero:9,  img:"/img/img_se/pasos_48.png",  titulo:"La Piedad",          cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa a la Virgen María sosteniendo en sus brazos el cuerpo de Jesús después de ser descendido de la cruz. Simboliza el dolor profundo de una madre y la compasión." },
      { numero:10, img:"/img/img_se/pasos_49.png",  titulo:"El Traslado al Sepulcro", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa el momento en que el cuerpo de Jesús es llevado hacia el lugar donde será sepultado. Simboliza el último acto de amor hacia Cristo antes de su descanso en el sepulcro." },
      p("san_juan",11),
      { numero:12, img:"/img/img_se/pasos_50.jpg",  titulo:"El Santo Sepulcro",  cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa a Jesús ya yacente dentro del sepulcro. Simboliza el reposo sagrado de Cristo tras culminar su sacrificio, así como la espera silenciosa antes de la Resurrección." },
      { numero:13, img:"/img/img_se/pasos_51.png",  titulo:"La Virgen de la Soledad", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa a María en el dolor silencioso y profundo que experimenta tras la muerte de su Hijo. Simboliza la soledad, la fidelidad y la fortaleza interior de la Virgen." },
    ],
    puntos:[
      { titulo:"Salida - Iglesia San Agustín",    hora:"7:00 PM",  desc:"Inicio desde el convento agustino, en absoluto silencio." },
      { titulo:"Calle de la Universidad",          hora:"7:45 PM",  desc:"Paso frente a la histórica Universidad del Cauca." },
      { titulo:"Plaza Mayor - Momento Solemne",    hora:"8:30 PM",  desc:"Honores militares al Santo Sepulcro, momento más emotivo." },
      { titulo:"Calle Real",                       hora:"9:15 PM",  desc:"Recorrido por el centro comercial histórico." },
      { titulo:"Regreso - San Agustín",            hora:"11:00 PM", desc:"Finalización con el recogimiento del Santo Sepulcro." },
    ],
  },

  sabado: {
    titulo:"Sábado Santo", subtitulo:"Procesión de la Resurrección",
    horario:"6:00 AM - 8:00 AM", num_pasos:"8 Pasos Procesionales", cargueros_totales:80,
    kilometros:2.0, horas:2.0, calles:8,
    mapa:"https://www.google.com/maps/embed?pb=!1m38!1m12!1m3!1d1185.1029570517421!2d-76.60695166810642!3d2.441903721488239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m23!3e2!4m5!1s0x8e300305549d061f%3A0xbf6f7babea98c6c4!2sCatedral%20Nuestra%20Se%C3%B1ora%20de%20La%20Asunci%C3%B3n!3m2!1d2.4412333!2d-76.60656089999999!4m5!1s0x8e30030ff9207c27%3A0xf76217f9f8464ebe!2sParque%20Caldas!3m2!1d2.4418674!2d-76.60627389999999!4m3!3m2!1d2.4427116!2d-76.607478!4m5!1s0x8e300305549d061f%3A0xbf6f7babea98c6c4!2sCatedral!3m2!1d2.4412333!2d-76.60656089999999!5e0!3m2!1ses-419!2sco!4v1755772950630!5m2!1ses-419!2sco",
    desc1:"El Sábado Santo cierra la Semana Santa payanesa con la Procesión de la Resurrección, un evento lleno de alegría y esperanza.",
    desc2:"La procesión se caracteriza por el repique de campanas, música festiva y la participación masiva de familias con niños.",
    desc3:"Esta procesión representa la esperanza cristiana y la vida nueva. A diferencia de las procesiones nocturnas de la semana, se realiza al amanecer.",
    pasos:[
      { numero:1, img:"/img/img_se/pasos_21.png", titulo:"Cirio Pascual",                   cargueros:"12 hombres", peso:"400 kg aprox.", material:"Madera y cera bendita",  desc:"Representa la luz de Cristo resucitado, signo de esperanza y vida eterna." },
      { numero:2, img:"/img/img_se/pasos_22.png", titulo:"María Salomé",                    cargueros:"18 hombres", peso:"600 kg aprox.", material:"Madera policromada",     desc:"Una de las santas mujeres que acudió al sepulcro. Figura de fidelidad y devoción." },
      { numero:3, img:"/img/img_se/pasos_23.png", titulo:"María la Madre de Santiago",      cargueros:"18 hombres", peso:"600 kg aprox.", material:"Madera policromada",     desc:"Mujer presente en el hallazgo del sepulcro vacío, símbolo de ternura y testimonio." },
      { numero:4, img:"/img/img_se/pasos_52.png", titulo:"María Magdalena",                 cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada",     desc:"Representa a María Magdalena como testigo y anunciadora de la Resurrección. Su figura encarna la fidelidad y el amor que permanecen más allá del sufrimiento." },
      { numero:5, img:"/img/img_se/pasos_53.png", titulo:"San Juan",                        cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada",     desc:"Representa a San Juan Evangelista como discípulo amado y testigo de la Resurrección. Simboliza la fidelidad, la esperanza y la alegría del triunfo de Cristo." },
      { numero:6, img:"/img/img_se/pasos_54.png", titulo:"San Pedro",                       cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada",     desc:"Representa al apóstol Pedro como figura de fortaleza y guía de la Iglesia. Simboliza la fe renovada tras la Resurrección y el arrepentimiento." },
      { numero:7, img:"/img/img_se/pasos_55.png", titulo:"Nuestra Señora de la Pascua",     cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada",     desc:"Representa a la Virgen María como Madre gozosa ante la Resurrección de su Hijo. Simboliza la alegría plena y la esperanza renovada." },
      { numero:8, img:"/img/img_se/pasos_56.png", titulo:"Nuestro Señor Jesucristo Resucitado", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera policromada", desc:"Representa a Cristo triunfante después de vencer la muerte. Es el paso central del Sábado Santo y el motivo de la celebración más festiva de la Semana Santa." },
    ],
    puntos:[
      { titulo:"Salida - Catedral Basílica", hora:"6:00 AM", desc:"Inicio al amanecer desde el templo mayor de la ciudad." },
      { titulo:"Plaza Mayor - Celebración", hora:"6:30 AM", desc:"Momento de mayor alegría con repique de campanas." },
      { titulo:"Calle Real",                hora:"7:00 AM", desc:"Recorrido festivo con participación de familias." },
      { titulo:"Regreso - Catedral",        hora:"8:00 AM", desc:"Finalización con Misa de Resurrección." },
    ],
  },

  domingo: {
    titulo:"Domingo de Ramos", subtitulo:"Inicio de la Semana Santa",
    horario:"9:00 AM", num_pasos:"2 Pasos Procesionales", cargueros_totales:50,
    desc1:"El Domingo de Ramos en Popayán inicia la Semana Santa, una tradición desde el siglo XVI que conmemora la entrada triunfal de Jesús a Jerusalén mediante una procesión diurna.",
    desc2:"Esta celebración se documenta desde 1556. Hasta 1900 honraba al Señor del Triunfo sobre un asno, atrayendo feligreses con palmas de pueblos indígenas vecinos. Hoy parte del Santuario de Belén hacia la Catedral Basílica.",
    desc3:"A las 9:00 AM se realiza la \"bajada del Amo\". Los participantes llevan ramos de palma y olivo bendecidos, simbolizando victoria y protección espiritual.",
    pasos:[
      p("ecce",1),
      { numero:2, img:"/img/img_se/pasos_58.png", titulo:"El Señor Caído", cargueros:"12 hombres", peso:"300 kg aprox.", material:"Madera tallada y policromada", desc:"Figura de Cristo desplomado bajo el peso de la cruz, con rostro de sufrimiento y compasión. Uno de los pasos más venerados, despierta profunda devoción en los fieles." },
    ],
  },
};

const DIAS   = ["lunes","martes","miercoles","jueves","viernes","sabado","domingo"];
const LABELS = { lunes:"Lunes Santo", martes:"Martes Santo", miercoles:"Miércoles Santo", jueves:"Jueves Santo", viernes:"Viernes Santo", sabado:"Sábado Santo", domingo:"Domingo de Ramos" };

// ══════════════════════════════════════════════════════════════
// COMPONENTES
// ══════════════════════════════════════════════════════════════
function Navbar({ user, onLogoutClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ddOpen,   setDdOpen]   = useState(false);
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
    <nav className={`pr-navbar ${scrolled ? "scrolled" : ""}`}>
      <Link to="/home" className="pr-logo-nav">
        <img src="/img/home/logo.png" alt="Logo" />
      </Link>
      <ul className="pr-nav-menu" style={menuOpen ? { display:"flex" } : {}}>
        {links.map(l => (
          <li key={l.label}><Link to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link></li>
        ))}
      </ul>
      <div className="pr-nav-actions">
        {user ? (
          <div style={{ position:"relative" }} ref={ddRef}>
            <div className="pr-profile-avatar" onClick={(e) => { e.stopPropagation(); setDdOpen(v => !v); }}>
              <img src={user.imagen_perfil || "https://res.cloudinary.com/de7ob8hb2/image/upload/v1768505287/avatar_naranja_ofufi8.png"} alt="Perfil" />
            </div>
            {ddOpen && (
              <div className="pr-dropdown">
                {user.rol === "empresario"    && <Link to="/redirect-by-role"><i className="fas fa-briefcase" /> Panel Empresarial</Link>}
                {user.rol === "administrador" && <Link to="/dashboard-administrador"><i className="fas fa-tachometer-alt" /> Dashboard Admin</Link>}
                <Link to="/perfil"><i className="fas fa-user-edit" /> Editar Perfil</Link>
                <button onClick={() => { setDdOpen(false); onLogoutClick(); }}><i className="fas fa-sign-out-alt" /> Cerrar Sesión</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="pr-icon-login"><i className="fas fa-user" /></Link>
        )}
        <button className="pr-hamburger" onClick={() => setMenuOpen(v => !v)}>
          <i className="fas fa-bars" />
        </button>
      </div>
    </nav>
  );
}

function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="pr-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pr-modal-box">
        <button className="pr-modal-close" onClick={onClose}>&times;</button>
        <h3>Cerrar Sesión</h3>
        <p>¿Estás seguro de que deseas cerrar sesión?</p>
        <div className="pr-modal-actions">
          <button className="pr-btn-cancel"  onClick={onClose}>Cancelar</button>
          <button className="pr-btn-confirm" onClick={onConfirm}><i className="fas fa-sign-out-alt" /> Sí, Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}

function PasoCard({ paso }) {
  return (
    <div className="pr-paso-card">
      <div className="pr-paso-header">
        <img src={paso.img} alt={paso.titulo} className="pr-paso-img" loading="lazy" />
        <div className="pr-paso-number">{paso.numero}</div>
      </div>
      <div className="pr-paso-content">
        <h4 className="pr-paso-title">{paso.titulo}</h4>
        <p className="pr-paso-desc">{paso.desc}</p>
        <div className="pr-paso-details">
          <div className="pr-paso-detail"><span className="pr-detail-label">Cargueros</span><span className="pr-detail-value">{paso.cargueros}</span></div>
          <div className="pr-paso-detail"><span className="pr-detail-label">Peso</span><span className="pr-detail-value">{paso.peso}</span></div>
          <div className="pr-paso-detail"><span className="pr-detail-label">Material</span><span className="pr-detail-value">{paso.material}</span></div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pr-footer">
      <div className="pr-footer-inner">
        <div className="pr-footer-logo-wrap">
          <div className="pr-footer-logo-line" />
          <div className="pr-footer-logo-circle">
            <img src="/img/home/logo_blanco.png" alt="Logo" />
          </div>
        </div>
        <div className="pr-footer-grid">
          <div className="pr-footer-section">
            <h3>Acerca de</h3>
            <ul>
              <li><a href="#">¿Quiénes somos?</a></li>
              <li><Link to="/terminos">Términos y condiciones</Link></li>
            </ul>
          </div>
          <div className="pr-footer-section">
            <h3>Contacto</h3>
            <ul>
              <li>Correo:<br />popayanalltour</li>
              <li>Línea gratuita:<br />312 231 1230</li>
            </ul>
          </div>
          <div className="pr-footer-section">
            <h3>Redes Sociales</h3>
            <ul>
              {[
                { icon:"fab fa-instagram", text:"@PopayanAllTour",    href:"https://www.instagram.com/popayanalltour/" },
                { icon:"fab fa-facebook",  text:"Popayan AllTour",    href:"https://www.facebook.com/profile.php?id=61578069024241" },
                { icon:"fab fa-youtube",   text:"@popayanAlltour5002",href:"#" },
              ].map((s, i) => (
                <li key={i} className="pr-social-item"><i className={s.icon} /><a href={s.href}>{s.text}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pr-footer-bottom">© PopayanAllTour | Todos los derechos reservados</div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function Procesiones() {
  const [user,        setUser]        = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [activeDay,   setActiveDay]   = useState("lunes");
  const navigate = useNavigate();
  const location = useLocation();
  const navRef   = useRef(null);

  useEffect(() => {
    axios.get("/api/usuarios/me/", { withCredentials:true })
      .then(r => setUser(r.data))
      .catch(() => setUser(null));
  }, []);

  // Leer hash de URL al cargar (#lunes, #martes, etc.)
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && DIAS.includes(hash)) setActiveDay(hash);
  }, [location.hash]);

  const handleLogout = async () => {
    try { await axios.post("/api/auth/logout/", {}, { withCredentials:true }); } catch (_) {}
    setUser(null); setLogoutModal(false); navigate("/login");
  };

  const changeDay = (day) => {
    setActiveDay(day);
    if (navRef.current) {
      window.scrollTo({ top: navRef.current.offsetTop - 100, behavior:"smooth" });
    }
  };

  const data = PROCESIONES[activeDay];

  return (
    <>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.4.0/css/all.css" />
      <Navbar user={user} onLogoutClick={() => setLogoutModal(true)} />
      <LogoutModal open={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={handleLogout} />

      {/* HEADER */}
      <section className="pr-header">
        <div className="pr-container">
          <div className="pr-header-content">
            <h1 className="pr-header-title">Procesiones</h1>
            <div className="pr-header-dis">
              <p className="pr-header-subtitle">
                Descubre la grandeza de la Semana Santa payanesa, una tradición única que combina fe, historia y cultura.
                Vive cada día de esta celebración sagrada conociendo en detalle los pasos que procesionan,
                sus significados y la riqueza artística que encierran.
              </p>
              <img src="/img/img_se/quince.jpeg" alt="Semana Santa" className="pr-header-img" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="pr-container" ref={navRef}>
        <nav className="pr-days-nav">
          {DIAS.map(d => (
            <button key={d} className={`pr-day-tab ${activeDay === d ? "active" : ""}`} onClick={() => changeDay(d)}>
              {LABELS[d]}
            </button>
          ))}
        </nav>
      </div>

      {/* CONTENIDO */}
      <main className="pr-main">
        <div className="pr-container">

          {/* Cabecera del día */}
          <div className="pr-day-header">
            <h2 className="pr-day-title">{data.titulo}</h2>
            <p className="pr-day-subtitle">{data.subtitulo}</p>
            <div className="pr-day-meta">
              <div className="pr-meta-item"><i className="far fa-clock" /> {data.horario}</div>
              <div className="pr-meta-item"><i className="fas fa-layer-group" /> {data.num_pasos}</div>
              <div className="pr-meta-item"><i className="fas fa-users" /> {data.cargueros_totales} Cargueros</div>
            </div>
          </div>

          {/* Descripción */}
          <div className="pr-day-desc">
            <h3 className="pr-section-title">Sobre esta Procesión</h3>
            <p>{data.desc1}</p>
            <p>{data.desc2}</p>
            <p>{data.desc3}</p>
          </div>

          {/* Pasos */}
          <div className="pr-pasos-container">
            <h3 className="pr-section-title">Pasos Procesionales del {data.titulo}</h3>
            <div className="pr-pasos-grid">
              {data.pasos.map((paso, i) => <PasoCard key={i} paso={paso} />)}
            </div>
          </div>

          {/* Mapa y puntos (solo días con mapa) */}
          {data.mapa && data.puntos && (
            <div className="pr-mapa-section">
              <div className="pr-mapa-header">
                <div className="pr-mapa-info">
                  <h3>Recorrido del {data.titulo}</h3>
                  <p>Recorrido tradicional por el centro histórico de Popayán.</p>
                </div>
                <div className="pr-mapa-stats">
                  <div className="pr-stat-item"><span className="pr-stat-num">{data.kilometros}</span><span className="pr-stat-lbl">Kilómetros</span></div>
                  <div className="pr-stat-item"><span className="pr-stat-num">{data.horas}</span><span className="pr-stat-lbl">Horas</span></div>
                  <div className="pr-stat-item"><span className="pr-stat-num">{data.calles}</span><span className="pr-stat-lbl">Calles</span></div>
                </div>
              </div>
              <div className="pr-mapa-container">
                <iframe
                  src={data.mapa}
                  width="100%" height="400"
                  style={{ border:0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa ${data.titulo}`}
                />
              </div>
              <div className="pr-puntos-grid">
                {data.puntos.map((pt, i) => (
                  <div key={i} className="pr-punto-card">
                    <div className="pr-punto-title">{pt.titulo}</div>
                    <div className="pr-punto-time">{pt.hora}</div>
                    <div className="pr-punto-desc">{pt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}