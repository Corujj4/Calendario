import "./navbar.css";

export function renderNavbar() {
  const rotaAtual = window.location.hash.slice(1) || "/";

  function classeAtiva(rota) {
    return rotaAtual === rota ? "ativo" : "";
  }

  return `
    <nav class="navbar">
      <div class="navbar-conteudo">
        <a href="#/" class="navbar-logo">
          <div class="navbar-logo-icone">🥾</div>

          <div class="navbar-logo-texto">
            <strong>EcoTrekking</strong>
            <span>Aventura e natureza</span>
          </div>
        </a>

        <ul class="navbar-links">
          <li>
            <a href="#/" class="${classeAtiva("/")}">
              Início
            </a>
          </li>

          <li>
            <a
              href="#/calendario"
              class="${classeAtiva("/calendario")}"
            >
              Calendário
            </a>
          </li>

          <li>
            <a
              href="#/trilhas"
              class="${classeAtiva("/trilhas")}"
            >
              Trilhas
            </a>
          </li>

          <li>
            <a
              href="#/galeria"
              class="${classeAtiva("/galeria")}"
            >
              Galeria
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `;
}