import { rapeis } from "./ecodados.js";

function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obterNomeClima(clima) {
  switch (Number(clima)) {
    case 1:
      return "Verão";

    case 2:
      return "Primavera / Outono";

    case 3:
      return "Inverno";

    default:
      return "Não informado";
  }
}

function renderItemRapel(rapel) {
  return `
    <button
      class="rapel-item"
      type="button"
      data-rapel-id="${rapel.id}"
    >
      <div class="rapel-item-principal">
        <span class="rapel-item-id">#${rapel.id}</span>

        <div>
          <h2>${rapel.nome}</h2>

          <p>
            ${rapel.altura} m de altura
          </p>
        </div>
      </div>

      <div class="rapel-item-resumo">
        <span>
          <i class="fa-solid fa-users"></i>
          ${rapel.capacidade}
        </span>
      </div>
    </button>
  `;
}

function renderDetalhesRapel(rapel) {
  const local = rapel.local || "Local ainda não cadastrado";

  return `
    <div class="rapel-detalhes-conteudo">
      <header class="rapel-detalhes-cabecalho">
        <div>
        
          <h2>${rapel.nome}</h2>
        </div>
      </header>

      <div class="rapel-detalhes-grid">
        <div class="rapel-detalhe">
          <i class="fa-solid fa-arrow-down-long"></i>

          <div>
            <span>Altura</span>
            <strong>${rapel.altura} m</strong>
          </div>
        </div>

        <div class="rapel-detalhe">
          <i class="fa-solid fa-temperature-half"></i>

          <div>
            <span>Temperatura</span>
            <strong>${rapel.temperatura}</strong>
          </div>
        </div>

        <div class="rapel-detalhe">
          <i class="fa-solid fa-cloud-sun"></i>

          <div>
            <span>Grupo climático</span>
            <strong>${obterNomeClima(rapel.clima)}</strong>
          </div>
        </div>

        <div class="rapel-detalhe">
          <i class="fa-solid fa-location-dot"></i>

          <div>
            <span>Local</span>
            <strong>${local}</strong>
          </div>
        </div>

        <div class="rapel-detalhe">
          <i class="fa-solid fa-users"></i>

          <div>
            <span>Capacidade</span>
            <strong>${rapel.capacidade} pessoas</strong>
          </div>
        </div>
      </div>

      <div class="rapel-altimetria">
  <div class="rapel-altimetria-cabecalho">
    <h3>
      <i class="fa-solid fa-chart-area"></i>
      Esboço da descida
    </h3>

    <span>${rapel.altura} m</span>
  </div>

  <div class="rapel-altimetria-grafico">
    <div class="rapel-altimetria-linha"></div>
  </div>

  <div class="rapel-altimetria-legenda">
    <span>Início</span>
    <span>Base</span>
  </div>
</div>

      <div class="rapel-detalhes-acoes">
        <button class="botao-rapel-secundario" type="button">
          Ver no calendário
        </button>

        <button class="botao-rapel-principal" type="button">
          Ver detalhes completos
        </button>
      </div>
    </div>
  `;
}

function aplicarFiltrosRapel() {
  const campoBusca = document.querySelector("#busca-rapel");
  const filtroClima = document.querySelector("#filtro-clima-rapel");
  const lista = document.querySelector("#lista-rapeis");

  if (!campoBusca || !filtroClima || !lista) {
    return;
  }

  const busca = normalizarTexto(campoBusca.value);
  const clima = filtroClima.value;

  const resultado = rapeis.filter((rapel) => {
    const textoPesquisa = [
      rapel.id,
      rapel.nome,
      rapel.altura,
      rapel.clima,
      rapel.temperatura,
      rapel.local,
      rapel.capacidade,
      rapel.descricao,
      rapel.cidade,
      rapel.estado
    ]
      .filter((valor) => valor !== undefined && valor !== null)
      .join(" ");

    const combinaBusca = normalizarTexto(textoPesquisa).includes(busca);

    const combinaClima =
      !clima || String(rapel.clima) === clima;

    return combinaBusca && combinaClima;
  });

  lista.innerHTML = resultado.length
    ? resultado.map(renderItemRapel).join("")
    : `
      <div class="rapeis-vazio">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>Nenhum rapel encontrado.</p>
      </div>
    `;

  adicionarEventosRapeis();
}

function selecionarRapel(id) {
  const rapel = rapeis.find((item) => item.id === Number(id));
  const painel = document.querySelector("#painel-detalhes-rapel");

  if (!rapel || !painel) {
    return;
  }

  painel.innerHTML = renderDetalhesRapel(rapel);

  document.querySelectorAll(".rapel-item").forEach((item) => {
    item.classList.toggle(
      "ativa",
      Number(item.dataset.rapelId) === rapel.id
    );
  });
}

function adicionarEventosRapeis() {
  document.querySelectorAll(".rapel-item").forEach((item) => {
    item.addEventListener("click", () => {
      selecionarRapel(item.dataset.rapelId);
    });
  });
}

export function iniciarRapel() {
  const campoBusca = document.querySelector("#busca-rapel");
  const filtroClima = document.querySelector("#filtro-clima-rapel");

  campoBusca?.addEventListener("input", aplicarFiltrosRapel);
  filtroClima?.addEventListener("change", aplicarFiltrosRapel);

  adicionarEventosRapeis();

  if (rapeis.length) {
    selecionarRapel(rapeis[0].id);
  }
}

export function renderRapelView() {
  return `
    <div class="layout-pagina pagina-rapel">
      <header class="rapel-cabecalho">
        <h1>
          <i class="fa-solid fa-person-falling"></i>
          Catálogo de Rapéis
        </h1>

        <p>
          Explore, pesquise e consulte os rapéis disponíveis.
        </p>
      </header>

      <section class="rapel-filtros">
        <label class="campo-busca-rapel">
          <span>Pesquisar</span>

          <div>
            <i class="fa-solid fa-magnifying-glass"></i>

            <input
              id="busca-rapel"
              type="search"
              placeholder="Nome ou código do rapel"
            >
          </div>
        </label>

        <label>
          <span>Clima</span>

          <select id="filtro-clima-rapel">
            <option value="">Todos</option>
            <option value="1">Verão</option>
            <option value="2">Primavera-Outono</option>
            <option value="3">Inverno</option>
          </select>
        </label>
      </section>

      <main class="rapel-conteudo">
        <section
          id="lista-rapeis"
          class="rapel-lista"
          aria-label="Lista de rapéis"
        >
          ${rapeis.map(renderItemRapel).join("")}
        </section>

        <aside
          id="painel-detalhes-rapel"
          class="painel-detalhes-rapel"
        >
          <div class="rapel-detalhes-placeholder">
            <i class="fa-solid fa-person-falling"></i>
            <p>Selecione um rapel para visualizar os detalhes.</p>
          </div>
        </aside>
      </main>
    </div>
  `;
}