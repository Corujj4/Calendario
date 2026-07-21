import { renderHome } from "./pages/home.js";
import { renderCalendario } from "./pages/calendarioPage.js";
import { renderTrilhas } from "./pages/trilhas.js";
import { renderGaleria } from "./pages/galeria.js";
import { criarCalendario } from "./components/calendario/calendario.js";
import { configurarClima } from "./services/clima.js";
import { configurarEventos } from "./services/eventos.js";

const rotas = {
  "/": renderHome,
  "/calendario": renderCalendario,
  "/trilhas": renderTrilhas,
  "/galeria": renderGaleria,
};

function renderizarPagina() {
  const app = document.querySelector("#app");

  if (!app) {
    console.error('Elemento "#app" não encontrado.');
    return;
  }

  const rotaAtual = window.location.hash.slice(1) || "/";
  const renderizar = rotas[rotaAtual] || renderHome;

  app.innerHTML = renderizar();

  if (rotaAtual === "/calendario") {
    configurarClima();
    configurarEventos();
    criarCalendario();
  }
} 

export function iniciarRouter() {
  window.addEventListener("hashchange", renderizarPagina);
  renderizarPagina();
}