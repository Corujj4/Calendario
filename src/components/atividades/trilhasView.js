import { trilhas } from "./ecodados.js";


function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obterClasseDificuldade(dificuldade) {
  const texto = normalizarTexto(dificuldade);

  if (texto.includes("muito dificil")) {
    return "dificuldade-muito-dificil";
  }

  if (texto.includes("dificil")) {
    return "dificuldade-dificil";
  }

  if (texto.includes("facil-media")) {
    return "dificuldade-facil-media";
  }

  if (texto.includes("media")) {
    return "dificuldade-media";
  }

  return "dificuldade-facil";
}

function renderItemTrilha(trilha) {
  return `
    <button
      class="trilha-item"
      type="button"
      data-trilha-id="${trilha.id}"
    >
      <div class="trilha-item-principal">
        <span class="trilha-item-id">#${trilha.id}</span>

        <div>
          <h2>${trilha.nome}</h2>

          <p>
            ${trilha.distancia} km · nível ${trilha.nivel}
          </p>
        </div>
      </div>

      <div class="trilha-item-resumo">
        <span class="trilha-badge ${obterClasseDificuldade(trilha.dificuldade)}">
          ${trilha.dificuldade}
        </span>

        <span>
          <i class="fa-solid fa-users"></i>
          ${trilha.capacidade}
        </span>
      </div>
    </button>
  `;
}

function renderDetalhesTrilha(trilha) {
  const local = trilha.local || "Local ainda não cadastrado";

  return `
    <div class="trilha-detalhes-conteudo">
      <header class="trilha-detalhes-cabecalho">
        <div>
          <span class="trilha-detalhes-id"></span>
          <h2>${trilha.nome}</h2>
        </div>

        <span class="trilha-badge ${obterClasseDificuldade(trilha.dificuldade)}">
          ${trilha.dificuldade}
        </span>
      </header>

      <div class="trilha-detalhes-grid">
        <div class="trilha-detalhe">
          <i class="fa-solid fa-route"></i>
          <div>
            <span>Distância</span>
            <strong>${trilha.distancia} km</strong>
          </div>
        </div>

        <div class="trilha-detalhe">
          <i class="fa-solid fa-chart-line"></i>
          <div>
            <span>Nível</span>
            <strong>${trilha.nivel}/10</strong>
          </div>
        </div>

        <div class="trilha-detalhe">
          <i class="fa-solid fa-temperature-half"></i>
          <div>
            <span>Temperatura</span>
            <strong>${trilha.temperatura}</strong>
          </div>
        </div>

        <div class="trilha-detalhe">
          <i class="fa-solid fa-cloud-sun"></i>
          <div>
            <span>Grupo climático</span>
            <strong>${obterNomeClima(trilha.clima)}</strong>
          </div>
        </div>

        <div class="trilha-detalhe">
          <i class="fa-solid fa-location-dot"></i>
          <div>
            <span>Local</span>
            <strong>${local}</strong>
          </div>
        </div>

        <div class="trilha-detalhe">
          <i class="fa-solid fa-users"></i>
          <div>
            <span>Capacidade</span>
            <strong>${trilha.capacidade} pessoas</strong>
          </div>
        </div>
      </div>

      <div class="trilha-detalhes-acoes">
        <button class="botao-trilha-secundario" type="button">
          Ver no calendário
        </button>

        <button class="botao-trilha-principal" type="button">
          Ver detalhes completos
        </button>
      </div>
    </div>
  `;
}

function aplicarFiltros() {
  const campoBusca = document.querySelector("#busca-trilha");
  const filtroDificuldade = document.querySelector("#filtro-dificuldade");
  const filtroClima = document.querySelector("#filtro-clima");
  const lista = document.querySelector("#lista-trilhas");

  if (!campoBusca || !filtroDificuldade || !filtroClima || !lista) {
    return;
  }

  const busca = normalizarTexto(campoBusca.value);
  const dificuldade = filtroDificuldade.value;
  const clima = filtroClima.value;

  const resultado = trilhas.filter((trilha) => {
    const textoPesquisa = [
  trilha.id,
  trilha.nome,
  trilha.distancia,
  trilha.nivel,
  trilha.dificuldade,
  trilha.clima,
  trilha.temperatura,
  trilha.local,
  trilha.capacidade,
  trilha.descricao,
  trilha.cidade,
  trilha.estado
]
  .filter((valor) => valor !== undefined && valor !== null)
  .join(" ");

const combinaBusca = normalizarTexto(textoPesquisa).includes(busca);

    const combinaDificuldade =
      !dificuldade ||
      normalizarTexto(trilha.dificuldade).includes(dificuldade);

    const combinaClima =
      !clima || String(trilha.clima) === clima;

    return combinaBusca && combinaDificuldade && combinaClima;
  });

  lista.innerHTML = resultado.length
    ? resultado.map(renderItemTrilha).join("")
    : `
      <div class="trilhas-vazio">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>Nenhuma trilha encontrada.</p>
      </div>
    `;

  adicionarEventosItens();
}

function selecionarTrilha(id) {
  const trilha = trilhas.find((item) => item.id === Number(id));
  const painel = document.querySelector("#painel-detalhes-trilha");

  if (!trilha || !painel) {
    return;
  }

  painel.innerHTML = renderDetalhesTrilha(trilha);

  document.querySelectorAll(".trilha-item").forEach((item) => {
    item.classList.toggle(
      "ativa",
      Number(item.dataset.trilhaId) === trilha.id
    );
  });
}

function adicionarEventosItens() {
  document.querySelectorAll(".trilha-item").forEach((item) => {
    item.addEventListener("click", () => {
      selecionarTrilha(item.dataset.trilhaId);
    });
  });
}

export function iniciarTrilhas() {
  const campoBusca = document.querySelector("#busca-trilha");
  const filtroDificuldade = document.querySelector("#filtro-dificuldade");
  const filtroClima = document.querySelector("#filtro-clima");

  campoBusca?.addEventListener("input", aplicarFiltros);
  filtroDificuldade?.addEventListener("change", aplicarFiltros);
  filtroClima?.addEventListener("change", aplicarFiltros);

  adicionarEventosItens();

  if (trilhas.length) {
    selecionarTrilha(trilhas[0].id);
  }
}

export function renderTrilhasView() {
  return `
    <div class="layout-pagina pagina-trilhas">
      <header class="trilhas-cabecalho">
        <h1>
    <i class="fa-solid fa-person-hiking"></i>
    Catálogo de Trilhas
</h1>

<p>
  Explore, pesquise e consulte os percursos disponíveis.
</p>
      </header>

      <section class="trilhas-filtros">
        <label class="campo-busca-trilha">
          <span>Pesquisar</span>

          <div>
            <i class="fa-solid fa-magnifying-glass"></i>

            <input
              id="busca-trilha"
              type="search"
              placeholder="Nome ou código da trilha"
            >
          </div>
        </label>

        <label>
          <span>Dificuldade</span>

          <select id="filtro-dificuldade">
            <option value="">Todas</option>
            <option value="facil">Fácil</option>
            <option value="media">Média</option>
            <option value="dificil">Difícil</option>
          </select>
        </label>

        <label>
          <span>Clima</span>

          <select id="filtro-clima">
            <option value="">Todos</option>
            <option value="1">Verão</option>
            <option value="2">Primavera-Outono</option>
            <option value="3">Inverno</option>
          </select>
        </label>
      </section>

      <main class="trilhas-conteudo">
        <section
          id="lista-trilhas"
          class="trilhas-lista"
          aria-label="Lista de trilhas"
        >
          ${trilhas.map(renderItemTrilha).join("")}
        </section>

        <aside
          id="painel-detalhes-trilha"
          class="painel-detalhes-trilha"
        >
          <div class="trilha-detalhes-placeholder">
            <i class="fa-solid fa-person-hiking"></i>
            <p>Selecione uma trilha para visualizar os detalhes.</p>
          </div>
        </aside>
      </main>
    </div>
  `;
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
