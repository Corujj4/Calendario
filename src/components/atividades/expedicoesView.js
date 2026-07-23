import { expedicoes } from "./ecodados.js";

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

function renderItemExpedicao(expedicao) {
  return `
    <button
      class="expedicao-item"
      type="button"
      data-expedicao-id="${expedicao.id}"
    >
      <div class="expedicao-item-principal">
        <span class="expedicao-item-id">#${expedicao.id}</span>

        <div>
          <h2>${expedicao.nome}</h2>

          <p>
            ${expedicao.distancia} km · nível ${expedicao.nivel}
          </p>
        </div>
      </div>

      <div class="expedicao-item-resumo">
        <span
          class="expedicao-badge ${obterClasseDificuldade(expedicao.dificuldade)}"
        >
          ${expedicao.dificuldade}
        </span>

        <span>
          <i class="fa-solid fa-users"></i>
          ${expedicao.capacidade}
        </span>
      </div>
    </button>
  `;
}

function renderDetalhesExpedicao(expedicao) {
  const local = expedicao.local || "Local ainda não cadastrado";

  return `
    <div class="expedicao-detalhes-conteudo">
      <header class="expedicao-detalhes-cabecalho">
        <div>
        
          <h2>${expedicao.nome}</h2>
        </div>

        <span
          class="expedicao-badge ${obterClasseDificuldade(expedicao.dificuldade)}"
        >
          ${expedicao.dificuldade}
        </span>
      </header>

      <div class="expedicao-detalhes-grid">
        <div class="expedicao-detalhe">
          <i class="fa-solid fa-route"></i>

          <div>
            <span>Distância</span>
            <strong>${expedicao.distancia} km</strong>
          </div>
        </div>

        <div class="expedicao-detalhe">
          <i class="fa-solid fa-chart-line"></i>

          <div>
            <span>Nível</span>
            <strong>${expedicao.nivel}/10</strong>
          </div>
        </div>

        <div class="expedicao-detalhe">
          <i class="fa-solid fa-temperature-half"></i>

          <div>
            <span>Temperatura</span>
            <strong>${expedicao.temperatura}</strong>
          </div>
        </div>

        <div class="expedicao-detalhe">
          <i class="fa-solid fa-cloud-sun"></i>

          <div>
            <span>Grupo climático</span>
            <strong>${obterNomeClima(expedicao.clima)}</strong>
          </div>
        </div>

        <div class="expedicao-detalhe">
          <i class="fa-solid fa-location-dot"></i>

          <div>
            <span>Local</span>
            <strong>${local}</strong>
          </div>
        </div>

        <div class="expedicao-detalhe">
          <i class="fa-solid fa-users"></i>

          <div>
            <span>Capacidade</span>
            <strong>${expedicao.capacidade} pessoas</strong>
          </div>
        </div>
      </div>

      <div class="expedicao-mapa">
  <div class="expedicao-mapa-cabecalho">
    <h3>
      <i class="fa-solid fa-map-location-dot"></i>
      Percurso da expedição
    </h3>

    <span>Visualização preliminar</span>
  </div>

  <div class="expedicao-mapa-area">
    <div class="expedicao-mapa-linha"></div>

    <span class="expedicao-mapa-ponto inicio"></span>
    <span class="expedicao-mapa-ponto fim"></span>

    <span class="expedicao-mapa-texto inicio">
      Início
    </span>

    <span class="expedicao-mapa-texto fim">
      Destino
    </span>
  </div>
</div>

      <div class="expedicao-detalhes-acoes">
        <button class="botao-expedicao-secundario" type="button">
          Ver no calendário
        </button>

        <button class="botao-expedicao-principal" type="button">
          Ver detalhes completos
        </button>
      </div>
    </div>
  `;
}

function aplicarFiltrosExpedicoes() {
  const campoBusca = document.querySelector("#busca-expedicao");
  const filtroDificuldade = document.querySelector(
    "#filtro-dificuldade-expedicao"
  );
  const filtroClima = document.querySelector("#filtro-clima-expedicao");
  const lista = document.querySelector("#lista-expedicoes");

  if (!campoBusca || !filtroDificuldade || !filtroClima || !lista) {
    return;
  }

  const busca = normalizarTexto(campoBusca.value);
  const dificuldade = filtroDificuldade.value;
  const clima = filtroClima.value;

  const resultado = expedicoes.filter((expedicao) => {
    const textoPesquisa = [
      expedicao.id,
      expedicao.nome,
      expedicao.distancia,
      expedicao.nivel,
      expedicao.dificuldade,
      expedicao.clima,
      expedicao.temperatura,
      expedicao.local,
      expedicao.capacidade,
      expedicao.descricao,
      expedicao.cidade,
      expedicao.estado
    ]
      .filter((valor) => valor !== undefined && valor !== null)
      .join(" ");

    const combinaBusca = normalizarTexto(textoPesquisa).includes(busca);

    const combinaDificuldade =
      !dificuldade ||
      normalizarTexto(expedicao.dificuldade).includes(dificuldade);

    const combinaClima =
      !clima || String(expedicao.clima) === clima;

    return combinaBusca && combinaDificuldade && combinaClima;
  });

  lista.innerHTML = resultado.length
    ? resultado.map(renderItemExpedicao).join("")
    : `
      <div class="expedicoes-vazio">
        <i class="fa-solid fa-magnifying-glass"></i>
        <p>Nenhuma expedição encontrada.</p>
      </div>
    `;

  adicionarEventosExpedicoes();
}

function selecionarExpedicao(id) {
  const expedicao = expedicoes.find(
    (item) => item.id === Number(id)
  );

  const painel = document.querySelector(
    "#painel-detalhes-expedicao"
  );

  if (!expedicao || !painel) {
    return;
  }

  painel.innerHTML = renderDetalhesExpedicao(expedicao);

  document.querySelectorAll(".expedicao-item").forEach((item) => {
    item.classList.toggle(
      "ativa",
      Number(item.dataset.expedicaoId) === expedicao.id
    );
  });
}

function adicionarEventosExpedicoes() {
  document.querySelectorAll(".expedicao-item").forEach((item) => {
    item.addEventListener("click", () => {
      selecionarExpedicao(item.dataset.expedicaoId);
    });
  });
}

export function iniciarExpedicoes() {
  const campoBusca = document.querySelector("#busca-expedicao");

  const filtroDificuldade = document.querySelector(
    "#filtro-dificuldade-expedicao"
  );

  const filtroClima = document.querySelector(
    "#filtro-clima-expedicao"
  );

  campoBusca?.addEventListener(
    "input",
    aplicarFiltrosExpedicoes
  );

  filtroDificuldade?.addEventListener(
    "change",
    aplicarFiltrosExpedicoes
  );

  filtroClima?.addEventListener(
    "change",
    aplicarFiltrosExpedicoes
  );

  adicionarEventosExpedicoes();

  if (expedicoes.length) {
    selecionarExpedicao(expedicoes[0].id);
  }
}

export function renderExpedicoesView() {
  return `
    <div class="layout-pagina pagina-expedicoes">
      <header class="expedicoes-cabecalho">
        <h1>
          <i class="fa-solid fa-compass"></i>
          Catálogo de Expedições
        </h1>

        <p>
          Explore, pesquise e consulte as expedições disponíveis.
        </p>
      </header>

      <section class="expedicoes-filtros">
        <label class="campo-busca-expedicao">
          <span>Pesquisar</span>

          <div>
            <i class="fa-solid fa-magnifying-glass"></i>

            <input
              id="busca-expedicao"
              type="search"
              placeholder="Nome ou código da expedição"
            >
          </div>
        </label>

        <label>
          <span>Dificuldade</span>

          <select id="filtro-dificuldade-expedicao">
            <option value="">Todas</option>
            <option value="facil">Fácil</option>
            <option value="media">Média</option>
            <option value="dificil">Difícil</option>
          </select>
        </label>

        <label>
          <span>Clima</span>

          <select id="filtro-clima-expedicao">
            <option value="">Todos</option>
            <option value="1">Verão</option>
            <option value="2">Primavera-Outono</option>
            <option value="3">Inverno</option>
          </select>
        </label>
      </section>

      <main class="expedicoes-conteudo">
        <section
          id="lista-expedicoes"
          class="expedicoes-lista"
          aria-label="Lista de expedições"
        >
          ${expedicoes.map(renderItemExpedicao).join("")}
        </section>

        <aside
          id="painel-detalhes-expedicao"
          class="painel-detalhes-expedicao"
        >
          <div class="expedicao-detalhes-placeholder">
            <i class="fa-solid fa-compass"></i>
            <p>
              Selecione uma expedição para visualizar os detalhes.
            </p>
          </div>
        </aside>
      </main>
    </div>
  `;
}