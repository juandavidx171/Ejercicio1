import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DunkeBono.css";

// ── Toda la lógica del juego está aquí, traducida del juego.js original ──
function initGame(canvas, scoreDisplay, levelDisplay, notification) {
    canvas.width = 1362;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");

    let score = 0;
    let currentLevel = 1;
    let angle = 0;
    let isCharging = false;
    let power = 0;
    const maxPower = 100;

    // Imágenes
    const cannonImg = new Image(); cannonImg.src = "/img/juego/cañon.png";
    const bagelImg = new Image(); bagelImg.src = "/img/juego/pandebono.png";
    const cupImg = new Image(); cupImg.src = "/img/juego/tasa_aro.png";
    const obstImg = new Image(); obstImg.src = "/img/juego/madera.png";
    const bgImg = new Image(); bgImg.src = "/img/juego/imagen_juego.png";


    // Límites
    const boundaries = {
        cloudBoundary: { points: [], height: 60 },
        floorBoundary: { y: canvas.height - 40, height: 40 }
    };

    function generateCloudBoundary() {
        const points = [];
        for (let i = 0; i <= 20; i++) {
            const x = (canvas.width / 20) * i;
            const y = 40 + 20 * Math.sin((i / 20) * Math.PI * 4) + Math.sin(i * 0.8) * 10 + Math.cos(i * 1.2) * 8;
            points.push({ x, y });
        }
        boundaries.cloudBoundary.points = points;
    }
    generateCloudBoundary();

    // Cañón
    const cannon = { x: 50, y: canvas.height - 50, width: 70, height: 50 };

    // Taza
    const cup = {
        x: canvas.width - 200, y: canvas.height / 2 - 50,
        width: 150, height: 130,
        entryX: canvas.width - 187, entryY: canvas.height / 2 - 15, entryWidth: 95, entryHeight: 12,
        collisionBoxes: [
            { x: canvas.width - 197, y: canvas.height / 2 - 27, width: 8, height: 106 },
            { x: canvas.width - 90, y: canvas.height / 2 - 27, width: 8, height: 106 },
            { x: canvas.width - 190, y: canvas.height / 2 + 77, width: 98, height: 10 },
        ]
    };

    // Niveles
    const levelConfigs = [
        { name: "Primer Tiro al Café", obstacles: [{ x: 400, y: 500, width: 20, height: 100 }] },
        { name: "Café con Obstáculos", obstacles: [{ x: 300, y: 200, width: 120, height: 20, angle: Math.PI / 6 }, { x: 500, y: 400, width: 30, height: 150 }] },
        { name: "Molino Cafetero", obstacles: [{ x: 400, y: 250, width: 20, height: 120, rotating: true, rotationSpeed: 0.03 }, { x: 600, y: 450, width: 80, height: 15, angle: -Math.PI / 4 }] },
        { name: "Laberinto Cafetería", obstacles: [{ x: 250, y: 100, width: 20, height: 200 }, { x: 450, y: 300, width: 20, height: 200 }, { x: 650, y: 150, width: 20, height: 250 }, { x: 350, y: 50, width: 100, height: 20 }] },
        { name: "Doble Molinillo", obstacles: [{ x: 300, y: 200, width: 15, height: 100, rotating: true, rotationSpeed: 0.04 }, { x: 500, y: 350, width: 15, height: 120, rotating: true, rotationSpeed: -0.035 }, { x: 700, y: 150, width: 100, height: 20, angle: Math.PI / 3 }] },
        { name: "Pasillo Cafetería", obstacles: [{ x: 400, y: 0, width: 25, height: 250 }, { x: 400, y: 350, width: 25, height: 370 }, { x: 600, y: 0, width: 25, height: 200 }, { x: 600, y: 400, width: 25, height: 320 }] },
        { name: "Escalones del Bar", obstacles: [{ x: 200, y: 500, width: 80, height: 15, rotating: true, rotationSpeed: 0.02 }, { x: 350, y: 400, width: 80, height: 15, rotating: true, rotationSpeed: -0.025 }, { x: 500, y: 300, width: 80, height: 15, rotating: true, rotationSpeed: 0.03 }, { x: 650, y: 200, width: 80, height: 15, rotating: true, rotationSpeed: -0.02 }] },
        { name: "Batidor Gigante", obstacles: [{ x: 450, y: 280, width: 200, height: 15, rotating: true, rotationSpeed: 0.025 }, { x: 450, y: 280, width: 15, height: 200, rotating: true, rotationSpeed: 0.025 }, { x: 250, y: 150, width: 60, height: 20, angle: Math.PI / 4 }, { x: 700, y: 450, width: 60, height: 20, angle: -Math.PI / 4 }] },
        { name: "Caos Cafetero", obstacles: [{ x: 200, y: 300, width: 15, height: 80, rotating: true, rotationSpeed: 0.05 }, { x: 350, y: 150, width: 60, height: 15, rotating: true, rotationSpeed: -0.04 }, { x: 500, y: 450, width: 15, height: 100, rotating: true, rotationSpeed: 0.035 }, { x: 650, y: 250, width: 80, height: 15, rotating: true, rotationSpeed: -0.045 }, { x: 750, y: 100, width: 20, height: 150 }, { x: 100, y: 100, width: 20, height: 200 }] },
        { name: "Maestro Barista", obstacles: [{ x: 400, y: 280, width: 250, height: 20, rotating: true, rotationSpeed: 0.02 }, { x: 400, y: 280, width: 20, height: 250, rotating: true, rotationSpeed: 0.02 }, { x: 150, y: 200, width: 15, height: 120, rotating: true, rotationSpeed: 0.06 }, { x: 750, y: 350, width: 15, height: 120, rotating: true, rotationSpeed: -0.055 }, { x: 600, y: 100, width: 100, height: 25, angle: Math.PI / 6 }, { x: 550, y: 500, width: 100, height: 25, angle: -Math.PI / 6 }, { x: 300, y: 50, width: 25, height: 100 }, { x: 850, y: 450, width: 25, height: 150 }] },
    ];

    let obstacles = [];
    const balls = [];
    let mousePos = { x: 0, y: 0 };
    let animId = null;

    function initLevel(n) {
        if (n > levelConfigs.length) n = levelConfigs.length;
        obstacles = levelConfigs[n - 1].obstacles.map(o => ({ ...o, rotationAngle: 0 }));
        balls.length = 0;
        showNotif(`Nivel ${n}: ${levelConfigs[n - 1].name}`);
        if (levelDisplay) levelDisplay.textContent = `Nivel: ${n} — ${levelConfigs[n - 1].name}`;
    }

    function showNotif(msg) {
        if (!notification) return;
        notification.textContent = msg;
        notification.style.display = "block";
        setTimeout(() => { notification.style.display = "none"; }, 3000);
    }

    // ── Cloud boundary draw & collision ──
    function drawCloud() {
        if (!boundaries.cloudBoundary.points.length) return;
        ctx.save();
        const grad = ctx.createLinearGradient(0, 0, 0, boundaries.cloudBoundary.height);
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(0.5, "rgba(200,220,255,0.7)");
        grad.addColorStop(1, "rgba(150,180,255,0.5)");
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, boundaries.cloudBoundary.points[0].y);
        for (let i = 0; i < boundaries.cloudBoundary.points.length - 1; i++) {
            const a = boundaries.cloudBoundary.points[i];
            const b = boundaries.cloudBoundary.points[i + 1];
            ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        }
        const lp = boundaries.cloudBoundary.points[boundaries.cloudBoundary.points.length - 1];
        ctx.lineTo(lp.x, lp.y); ctx.lineTo(canvas.width, 0); ctx.closePath();
        ctx.fillStyle = grad; ctx.fill();
        ctx.restore();
    }

    function checkCloud(ball) {
        const pts = boundaries.cloudBoundary.points;
        if (!pts.length) return;
        let lp = pts[0], rp = pts[pts.length - 1];
        for (let i = 0; i < pts.length - 1; i++) {
            if (ball.x >= pts[i].x && ball.x <= pts[i + 1].x) { lp = pts[i]; rp = pts[i + 1]; break; }
        }
        const t = (ball.x - lp.x) / (rp.x - lp.x);
        const cloudY = lp.y + (rp.y - lp.y) * t;
        if (ball.y - ball.radius <= cloudY) {
            ball.y = cloudY + ball.radius;
            if (ball.dy < 0) { ball.dy = -ball.dy * 0.6; ball.dx += (Math.random() - 0.5) * 2; }
        }
    }

    function checkFloor(ball) {
        if (ball.y + ball.radius >= boundaries.floorBoundary.y) {
            ball.y = boundaries.floorBoundary.y - ball.radius;
            ball.dy = -ball.dy * 0.7;
            ball.dx *= 0.9;
            if (Math.abs(ball.dy) < 1) ball.dy = 0;
        }
    }

    function checkRectCollision(ball, rect) {
        const cx = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
        const cy = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));
        const dx = ball.x - cx, dy = ball.y - cy;
        const dist2 = dx * dx + dy * dy;
        if (dist2 >= ball.radius * ball.radius) return false;
        let nx = dx, ny = dy;
        if (dist2 === 0) {
            const ox = rect.width / 2 + ball.radius - Math.abs(ball.x - (rect.x + rect.width / 2));
            const oy = rect.height / 2 + ball.radius - Math.abs(ball.y - (rect.y + rect.height / 2));
            if (ox < oy) { nx = ball.x > (rect.x + rect.width / 2) ? 1 : -1; ny = 0; }
            else { nx = 0; ny = ball.y > (rect.y + rect.height / 2) ? 1 : -1; }
        } else {
            const d = Math.sqrt(dist2); nx /= d; ny /= d;
        }
        const pen = ball.radius - Math.sqrt(dist2);
        if (pen > 0) { ball.x += nx * pen; ball.y += ny * pen; }
        const vn = ball.dx * nx + ball.dy * ny;
        if (vn > 0) return true;
        const imp = -(1 + 0.6) * vn;
        ball.dx += imp * nx; ball.dy += imp * ny;
        return true;
    }

    function checkObstacleCollision(ball, obs) {
        const cx = obs.x + obs.width / 2, cy = obs.y + obs.height / 2;
        const rot = obs.rotating ? (obs.rotationAngle || 0) : (obs.angle || 0);
        const dx = ball.x - cx, dy = ball.y - cy;
        const rx = dx * Math.cos(-rot) - dy * Math.sin(-rot);
        const ry = dx * Math.sin(-rot) + dy * Math.cos(-rot);
        const clx = Math.max(-obs.width / 2, Math.min(obs.width / 2, rx));
        const cly = Math.max(-obs.height / 2, Math.min(obs.height / 2, ry));
        const distX = rx - clx, distY = ry - cly;
        const dist2 = distX * distX + distY * distY;
        if (dist2 >= ball.radius * ball.radius) return;
        let nx = distX, ny = distY;
        if (dist2 === 0) {
            const ox = obs.width / 2 + ball.radius - Math.abs(rx);
            const oy = obs.height / 2 + ball.radius - Math.abs(ry);
            if (ox < oy) { nx = rx > 0 ? 1 : -1; ny = 0; } else { nx = 0; ny = ry > 0 ? 1 : -1; }
        } else { const d = Math.sqrt(dist2); nx /= d; ny /= d; }
        const wnx = nx * Math.cos(rot) - ny * Math.sin(rot);
        const wny = nx * Math.sin(rot) + ny * Math.cos(rot);
        const pen = ball.radius - Math.sqrt(dist2);
        ball.x += wnx * pen; ball.y += wny * pen;
        const vn = ball.dx * wnx + ball.dy * wny;
        if (vn > 0) return;
        const imp = -(1 + 0.7) * vn;
        ball.dx += imp * wnx; ball.dy += imp * wny;
    }

    function checkCupScore(ball) {
        const inX = ball.x >= cup.entryX && ball.x <= cup.entryX + cup.entryWidth;
        const inY = ball.y >= cup.entryY && ball.y <= cup.entryY + cup.entryHeight;
        const falling = ball.dy > 0;
        let clean = true;
        cup.collisionBoxes.forEach(b => {
            if ((ball.x + ball.radius) > b.x && (ball.x - ball.radius) < b.x + b.width &&
                (ball.y + ball.radius) > b.y && (ball.y - ball.radius) < b.y + b.height) clean = false;
        });
        return inX && inY && falling && clean;
    }

    function drawCannon() {
        ctx.save();
        ctx.translate(cannon.x, cannon.y);
        ctx.rotate(angle);
        ctx.drawImage(cannonImg, -cannon.width / 20, -cannon.height / 20, cannon.width, cannon.height);
        ctx.restore();
    }

    function drawBalls() {
        balls.forEach(ball => {
            if (bagelImg.complete && bagelImg.naturalWidth) {
                ctx.drawImage(bagelImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 5, ball.radius * 5);
            } else {
                ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = "orange"; ctx.fill();
            }
        });
    }

    function drawCup() {
        if (cupImg.complete && cupImg.naturalWidth) {
            ctx.drawImage(cupImg, cup.x, cup.y, cup.width, cup.height);
        } else {
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(cup.x, cup.y, cup.width, cup.height);
        }
    }

    function drawObstacles() {
        obstacles.forEach(obs => {
            ctx.save();
            ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);
            if (obs.rotating) { obs.rotationAngle = (obs.rotationAngle || 0) + obs.rotationSpeed; ctx.rotate(obs.rotationAngle); }
            else if (obs.angle) ctx.rotate(obs.angle);
            if (obstImg.complete && obstImg.naturalWidth) {
                ctx.drawImage(obstImg, -obs.width / 2, -obs.height / 2, obs.width, obs.height);
            } else {
                ctx.fillStyle = "#8B4513"; ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
            }
            ctx.restore();
        });
    }

    function drawPowerBar() {
        if (!isCharging) return;
        const bw = 200, bh = 20, bx = canvas.width / 2 - bw / 2, by = 40;
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(bx - 5, by - 5, bw + 10, bh + 10);
        ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
        ctx.fillStyle = power < 30 ? "#4CAF50" : power < 40 ? "#FFEB3B" : power < 60 ? "#FF9800" : "#F44336";
        ctx.fillRect(bx, by, (power / maxPower) * bw, bh);
        ctx.fillStyle = "white"; ctx.font = "bold 16px Poppins"; ctx.textAlign = "center";
        ctx.fillText(`Potencia: ${Math.floor(power)}%`, canvas.width / 2, by - 10);
        ctx.font = "14px Poppins"; ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillText("Mantén presionado para cargar, suelta para disparar", canvas.width / 2, by + bh + 20);
    }

    function moveBalls() {
        for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i];
            ball.x += ball.dx; ball.y += ball.dy; ball.dy += 0.2;
            checkCloud(ball); checkFloor(ball);
            if (ball.x + ball.radius > canvas.width) { ball.x = canvas.width - ball.radius; ball.dx *= -0.8; }
            if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.dx *= -0.8; }
            if (ball.y + ball.radius > canvas.height) { balls.splice(i, 1); continue; }
            obstacles.forEach(obs => checkObstacleCollision(ball, obs));
            cup.collisionBoxes.forEach(b => checkRectCollision(ball, b));
            if (checkCupScore(ball)) {
                score++;
                if (scoreDisplay) scoreDisplay.textContent = `Puntuación: ${score}`;
                balls.splice(i, 1);
                if (currentLevel < levelConfigs.length) {
                    currentLevel++;
                    setTimeout(() => initLevel(currentLevel), 1000);
                    showNotif(`¡Excelente! El pandebono cayó en el café. Nivel ${currentLevel}`);
                } else { showNotif("¡Felicidades! ¡Has completado todos los niveles!"); }
            }
        }
    }

   function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // ← AÑADE ESTO
  if (bgImg.complete && bgImg.naturalWidth) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }
  
  drawCloud();
  drawCannon();
  drawPowerBar();
  drawBalls();
  drawCup();
  drawObstacles();
  moveBalls();
  if (isCharging) power = Math.min(power + 2, maxPower);
  animId = requestAnimationFrame(loop);
}

    // Eventos — sobre el canvas escalado
    function getCanvasPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }

    function onMouseMove(e) {
        const pos = getCanvasPos(e);
        mousePos = pos;
        angle = Math.atan2(pos.y - cannon.y, pos.x - cannon.x);
    }
    function onMouseDown() { isCharging = true; power = 0; }
    function onMouseUp() {
        if (!isCharging) return;
        const sp = (power / 100) * 50;
        balls.push({ x: cannon.x + Math.cos(angle) * cannon.width, y: cannon.y + Math.sin(angle) * cannon.width, dx: Math.cos(angle) * sp, dy: Math.sin(angle) * sp, radius: 12 });
        isCharging = false; power = 0;
    }
    function onKeyDown(e) {
        if (e.key === "r" || e.key === "R") initLevel(currentLevel);
        if ((e.key === "n" || e.key === "N") && currentLevel < levelConfigs.length) { currentLevel++; initLevel(currentLevel); }
        if ((e.key === "p" || e.key === "P") && currentLevel > 1) { currentLevel--; initLevel(currentLevel); }
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keydown", onKeyDown);

    initLevel(1);
    loop();

    return () => {
        cancelAnimationFrame(animId);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("keydown", onKeyDown);
    };
}

// ── COMPONENTE ──
export default function DunkeBonoJuego() {
    const canvasRef = useRef(null);
    const scoreRef = useRef(null);
    const levelRef = useRef(null);
    const notifRef = useRef(null);
    const navigate = useNavigate();
    const [navScrolled, setNavScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);

    useEffect(() => {
        axios.get("/api/user/", { withCredentials: true }).then(r => setUser(r.data)).catch(() => { });
    }, []);

    useEffect(() => {
        const onScroll = () => setNavScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        const cleanup = initGame(canvasRef.current, scoreRef.current, levelRef.current, notifRef.current);
        return cleanup;
    }, []);

    const handleLogout = async () => {
        try { await axios.post("/logout/", {}, { withCredentials: true }); }
        finally { window.location.href = "/login/"; }
    };

    return (
        <div className="dk-page" style={{ background: "#87CEEB" }}>
            {/* NAVBAR */}
            <nav className={`dk-navbar${navScrolled ? " scrolled" : ""}`}>
                <Link to="/" className="dk-logo-nav"><img src="/img/home/logo.png" alt="Logo" /></Link>
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
                                <div className="dk-profile-avatar" onClick={e => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}>
                                    <img src={user.imagen_perfil || "/img/default-avatar.png"} alt="Perfil" />
                                </div>
                                {dropdownOpen && (
                                    <div className="dk-dropdown">
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

            {logoutModal && (
                <div className="dk-modal-overlay" onClick={() => setLogoutModal(false)}>
                    <div className="dk-modal" onClick={e => e.stopPropagation()}>
                        <span className="dk-modal-close" onClick={() => setLogoutModal(false)}>&times;</span>
                        <h3>Cerrar Sesión</h3><p>¿Estás seguro?</p>
                        <div className="dk-modal-actions">
                            <button className="dk-btn-cancel" onClick={() => setLogoutModal(false)}>Cancelar</button>
                            <button className="dk-btn-logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Sí</button>
                        </div>
                    </div>
                </div>
            )}

            {/* GAME CONTAINER */}
            <div className="dk-game-container">
                <div className="dk-canvas-wrapper">
                    <button className="dk-menu-btn" onClick={() => navigate("/juegos/dunkebono")}>← Volver al Menú</button>
                    <canvas ref={canvasRef} id="gameCanvas" />
                    <div ref={scoreRef} className="dk-score-display">Puntuación: 0</div>
                    <div ref={levelRef} className="dk-level-display">Nivel: 1</div>
                </div>
            </div>

            <div ref={notifRef} className="dk-notification" style={{ display: "none" }}></div>

            {/* FOOTER */}
            <footer className="dk-footer">
                <div className="dk-footer-content">
                    <div className="dk-logo-section">
                        <div className="dk-logo-footer"><img src="/img/home/logo_blanco.png" alt="Logo" /></div>
                        <div className="dk-linea-horizontal"></div>
                    </div>
                    <div className="dk-footer-grid">
                        <div className="dk-footer-section"><h3>Acerca de</h3><ul><li><a href="#">¿Quiénes somos?</a></li><li><Link to="/terminos">Términos y condiciones</Link></li></ul></div>
                        <div className="dk-footer-section"><h3>Contacto</h3><ul><li>Correo: <br />popayanalltour</li><li>Línea gratuita: <br /> 312 231 1230</li></ul></div>
                        <div className="dk-footer-section"><h3>Redes Sociales</h3><ul className="dk-social-icons"><li><i className="fab fa-instagram"></i><a href="https://www.instagram.com/popayanalltour/">@PopayanAllTour</a></li><li><i className="fab fa-facebook"></i><a href="https://www.facebook.com/profile.php?id=61578069024241">Popayan AllTour</a></li><li><i className="fab fa-youtube"></i> @popayanAlltour5002</li></ul></div>
                    </div>
                    <div className="dk-footer-bottom"><p>&copy; PopayanAllTour | Todos los derechos reservados</p></div>
                </div>
            </footer>
        </div>
    );
}