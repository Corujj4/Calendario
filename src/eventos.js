const painelEvento = document.querySelector("#painel-evento");
const calendario = document.querySelector("#calendario");

const eventos = new Map();

let dataSelecionada = null;
let eventoEditando = null;

export function configurarEventos() {
  calendario.addEventListener("click", tratarCliqueCalendario);

  painelEvento.addEventListener("click", tratarCliquePainel);
  painelEvento.addEventListener("submit", salvarEvento);
}

function tratarCliquePainel(eventoClique) {
  const botaoFechar = eventoClique.target.closest(
    "#botao-fechar-painel",
  );

  if (botaoFechar) {
    fecharPainel();
    return;
  }

  const botaoEditar = eventoClique.target.closest(
    '[data-acao="editar"]',
  );

  if (botaoEditar) {
    const eventoId = botaoEditar.dataset.eventoId;

    abrirFormularioEdicao(eventoId);
  }
}

function tratarCliqueCalendario(eventoClique) {
  const botaoEvento = eventoClique.target.closest(".resumo-evento");

  if (botaoEvento) {
    const eventoId = botaoEvento.dataset.eventoId;

    abrirDetalhesEvento(eventoId);
    return;
  }

  const botaoAdicionar = eventoClique.target.closest(
    ".botao-adicionar-evento",
  );

  if (!botaoAdicionar) {
    return;
  }

  const cardDia = botaoAdicionar.closest(".card-dia");

  dataSelecionada = cardDia.dataset.data;

  abrirFormularioNovoEvento(cardDia.dataset.dia);
}

function abrirFormularioNovoEvento(dia) {
  painelEvento.innerHTML = `
    <form id="formulario-evento" class="formulario-evento">
      <div class="cabecalho-painel">
        <div>
          <h2>Novo evento</h2>
          <p>Dia ${dia}</p>
        </div>

        <button
          id="botao-fechar-painel"
          class="botao-fechar-painel"
          type="button"
          aria-label="Fechar painel"
        >
          ×
        </button>
      </div>

      <label for="titulo-evento">Título</label>
      <input
        id="titulo-evento"
        name="titulo"
        type="text"
        required
      />

      <label for="descricao-evento">Descrição</label>
      <textarea
        id="descricao-evento"
        name="descricao"
        rows="6"
        required
      ></textarea>

    

      <label for="status-evento">Status</label>
      <select id="status-evento" name="status">
        <option value="lancado">Lançado</option>
        <option value="confirmado">Confirmado</option>
        <option value="cancelado">Cancelado</option>
      </select>

      <button class="botao-controle botao-destaque" type="submit">
        Salvar evento
      </button>
    </form>
  `;
}
function abrirDetalhesEvento(eventoId) {
    
  const eventoEncontrado = eventos.find(
    (evento) => evento.id === eventoId,
  );

  if (!eventoEncontrado) {
    return;
  }

  painelEvento.innerHTML = `
    <div class="detalhes-evento">
      <div class="cabecalho-painel">
        <div>
          <h2>${eventoEncontrado.titulo}</h2>
          <p>${eventoEncontrado.data}</p>
        </div>

        <button
          id="botao-fechar-painel"
          class="botao-fechar-painel"
          type="button"
          aria-label="Fechar painel"
        >
          ×
        </button>
      </div>

      <div class="campo-detalhe">
        <strong>Descrição</strong>
        <p>${eventoEncontrado.descricao}</p>
      </div>

      <div class="campo-detalhe">
        <strong>Status</strong>
        <p class="status-evento status-${eventoEncontrado.status}">
          ${formatarStatus(eventoEncontrado.status)}
        </p>
      </div>

      <div class="acoes-evento">
        <button
          class="botao-controle"
          type="button"
          data-acao="editar"
          data-evento-id="${eventoEncontrado.id}"
        >
          Editar
        </button>

        <button
          class="botao-controle"
          type="button"
          data-acao="excluir"
          data-evento-id="${eventoEncontrado.id}"
        >
          Excluir
        </button>
      </div>
    </div>
  `;
}
function abrirFormularioEdicao(eventoId) {
  const evento = eventos.find(
    (item) => item.id === eventoId
  );

  if (!evento) {
    return;
  }

  eventoEditando = evento.id;
  dataSelecionada = evento.data;

  abrirFormularioNovoEvento(
    Number(evento.data.slice(-2))
  );

  document.querySelector("#titulo-evento").value =
    evento.titulo;

  document.querySelector("#descricao-evento").value =
    evento.descricao;

  document.querySelector("#status-evento").value =
    evento.status;
}

function salvarEvento(eventoSubmit) {
  eventoSubmit.preventDefault();

  const formulario = eventoSubmit.target;

  if (eventoEditando) {
    const eventoExistente = eventos.find(
      (evento) => evento.id === eventoEditando,
    );

    if (!eventoExistente) {
      return;
    }

    eventoExistente.titulo = formulario.titulo.value.trim();
    eventoExistente.descricao = formulario.descricao.value.trim();
    eventoExistente.status = formulario.status.value;

    atualizarEventoNoCalendario(eventoExistente);

    eventoEditando = null;
    fecharPainel();
    return;
  }

  const novoEvento = {
    id: crypto.randomUUID(),
    data: dataSelecionada,
    titulo: formulario.titulo.value.trim(),
    descricao: formulario.descricao.value.trim(),
    status: formulario.status.value,
  };

  eventos.push(novoEvento);

  mostrarEventoNoCalendario(novoEvento);
  fecharPainel();
}

function mostrarEventoNoCalendario(evento) {
  const cardDia = calendario.querySelector(
    `[data-data="${evento.data}"]`,
  );

  if (!cardDia) {
    return;
  }

  const areaEventos = cardDia.querySelector(".eventos-dia");

  const botaoEvento = document.createElement("button");

    botaoEvento.classList.add(
    "resumo-evento",
    `evento-${evento.status}`,
    );

  botaoEvento.type = "button";
  botaoEvento.dataset.eventoId = evento.id;

  botaoEvento.innerHTML = `
    <strong>${evento.titulo}</strong>
    <span>${formatarStatus(evento.status)}</span>
  `;

  areaEventos.appendChild(botaoEvento);
}
function atualizarEventoNoCalendario(evento) {
  const botaoEvento = calendario.querySelector(
    `[data-evento-id="${evento.id}"]`,
  );

  if (!botaoEvento) {
    return;
  }

  botaoEvento.className =
    `resumo-evento evento-${evento.status}`;

  botaoEvento.innerHTML = `
    <strong>${evento.titulo}</strong>
    <span>${formatarStatus(evento.status)}</span>
  `;
}

function formatarStatus(status) {
  const nomesStatus = {
    lancado: "Lançado",
    confirmado: "Confirmado",
    cancelado: "Cancelado",
  };

  return nomesStatus[status];
}

function fecharPainel() {
  dataSelecionada = null;
  eventoEditando = null;

  painelEvento.innerHTML = `
    <div class="painel-vazio">
      <h2>Detalhes</h2>

      <p>
        Nenhum evento selecionado.<br />
        Clique em um evento ou no botão de adicionar de um dia.
      </p>
    </div>
  `;
}