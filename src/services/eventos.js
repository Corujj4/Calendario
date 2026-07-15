import { obterPrevisaoPorData } from "../services/clima.js";
import { carregarEventos, salvarEventos } from "../services/storageService.js";

const painelEvento = document.querySelector("#painel-evento");
const calendario = document.querySelector("#calendario");

const eventos = carregarEventos();

let dataSelecionada = null;
let eventoEditando = null;

export function configurarEventos() {
  document.addEventListener("calendarioRenderizado", mostrarTodosEventos);
  calendario.addEventListener("click", tratarCliqueCalendario);

  painelEvento.addEventListener("click", tratarCliquePainel);
  painelEvento.addEventListener("submit", salvarEvento);
}

function salvarEventosNoNavegador() {
  salvarEventos(eventos);
}

function tratarCliquePainel(eventoClique) {
  const botaoFechar = eventoClique.target.closest("#botao-fechar-painel");

  const eventoDoPainel = eventoClique.target.closest(".evento-painel");

  if (eventoDoPainel) {
    abrirDetalhesEvento(eventoDoPainel.dataset.eventoId);
    return;
  }

  if (botaoFechar) {
    fecharPainel();
    return;
  }

  const botaoEditar = eventoClique.target.closest('[data-acao="editar"]');

  if (botaoEditar) {
    abrirFormularioEdicao(botaoEditar.dataset.eventoId);
    return;
  }
  const botaoNovoEvento = eventoClique.target.closest(
    '[data-acao="novo-evento"]',
  );

  if (botaoNovoEvento) {
    dataSelecionada = botaoNovoEvento.dataset.data;

    abrirFormularioNovoEvento(Number(dataSelecionada.slice(-2)));

    return;
  }

  const botaoExcluir = eventoClique.target.closest('[data-acao="excluir"]');

  if (botaoExcluir) {
    abrirConfirmacaoExclusao(botaoExcluir.dataset.eventoId);
    return;
  }

  const botaoCancelarExclusao = eventoClique.target.closest(
    '[data-acao="cancelar-exclusao"]',
  );

  if (botaoCancelarExclusao) {
    abrirDetalhesEvento(botaoCancelarExclusao.dataset.eventoId);
    return;
  }

  const botaoConfirmarExclusao = eventoClique.target.closest(
    '[data-acao="confirmar-exclusao"]',
  );

  if (botaoConfirmarExclusao) {
    excluirEvento(botaoConfirmarExclusao.dataset.eventoId);
  }
}

function mostrarTodosEventos() {
  eventos.forEach((evento) => {
    mostrarEventoNoCalendario(evento);
  });
}

function tratarCliqueCalendario(eventoClique) {
  const botaoEvento = eventoClique.target.closest(".resumo-evento");

  if (botaoEvento) {
    abrirDetalhesEvento(botaoEvento.dataset.eventoId);
    return;
  }

  const cardDia = eventoClique.target.closest(".card-dia");

  if (cardDia && !cardDia.classList.contains("dia-vazio")) {
    abrirDetalhesDia(cardDia);
  }
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
      <label for="local-evento">Local</label>
      <input
        id="local-evento"
        name="local"
        type="text"
        placeholder="Ex.: Morro do Elefante"
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
  const eventoEncontrado = eventos.find((evento) => evento.id === eventoId);

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

        <p class="detalhe-evento">
  <span class="detalhe-icone">📍</span>

  <span>
    ${eventoEncontrado.local || "Local não informado"}
  </span>
</p>

<p class="detalhe-evento">
  <span class="detalhe-icone">📝</span>

  <span>
    ${eventoEncontrado.descricao || "Sem descrição"}
  </span>
</p>

<p class="detalhe-evento status-${eventoEncontrado.status}">
  <span class="status-bolinha"></span>

  <span>
    ${formatarStatus(eventoEncontrado.status)}
  </span>
</p>

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

function abrirDetalhesDia(cardDia) {
  const data = cardDia.dataset.data;

  const eventosDoDia = eventos.filter((evento) => evento.data === data);

  const climaDia =
    cardDia.querySelector(".clima-dia")?.innerHTML ??
    "<span>Clima indisponível</span>";

  const classeClima =
    cardDia.querySelector(".clima-dia")?.className ?? "clima-dia";

  const listaEventos =
    eventosDoDia.length > 0
      ? eventosDoDia
          .map(
            (evento) => `
              <button
                class="evento-painel evento-${evento.status}"
                type="button"
                data-evento-id="${evento.id}"
              >
                <strong>${evento.titulo}</strong>
                <span>${formatarStatus(evento.status)}</span>
              </button>
            `,
          )
          .join("")
      : "<p class='sem-eventos'>Nenhum evento neste dia.</p>";

  const dataFormatada = formatarData(data);
  const timelineClima = criarTimelineClima(data);
  painelEvento.innerHTML = `
    <div class="detalhes-dia">
            <div class="cabecalho-painel">
          <div class="data-painel">
          <span>${dataFormatada.diaSemana}</span>
          <h2>${dataFormatada.dataCompleta}</h2>
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

      <section class="clima-painel">
        <h3>Previsão do tempo</h3>

          <div class="conteudo-clima-painel">
        ${climaDia}
         </div>
        </section>
        <section class="timeline-painel">
          <h3>Previsão por horário</h3>

           ${timelineClima}
          </section>

      <section class="eventos-painel">
        <h3>Eventos</h3>

        <div class="lista-eventos-painel">
          ${listaEventos}
        </div>
      </section>

      <button
        class="botao-controle botao-destaque"
        type="button"
        data-acao="novo-evento"
        data-data="${data}"
      >
        Novo evento
      </button>
    </div>
  `;
}
function criarTimelineClima(data) {
  const previsao = obterPrevisaoPorData(data);
  console.log(previsao);
  const horas = previsao?.horas ?? [];

  if (horas.length === 0) {
    return `
      <p class="timeline-indisponivel">
        Previsão por horário indisponível.
      </p>
    `;
  }

  return `
    <div class="timeline-clima">
      ${horas
        .map(
          (hora) => `
        <div class="timeline-item">
          <strong>${hora.horario}</strong>

          <span class="timeline-temperatura">
            ${hora.temperatura}°
          </span>

          <span class="timeline-chuva">
            🌧 ${hora.chanceChuva}%
          </span>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-").map(Number);

  const dataLocal = new Date(ano, mes - 1, dia);

  const diaSemana = dataLocal.toLocaleDateString("pt-BR", {
    weekday: "long",
  });

  const dataCompleta = dataLocal.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    diaSemana: diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1),

    dataCompleta: dataCompleta.charAt(0).toUpperCase() + dataCompleta.slice(1),
  };
}

function abrirConfirmacaoExclusao(eventoId) {
  const eventoEncontrado = eventos.find((evento) => evento.id === eventoId);

  if (!eventoEncontrado) {
    return;
  }

  painelEvento.innerHTML = `
    <div class="confirmacao-exclusao">
      <div class="cabecalho-painel">
        <div>
          <h2>Excluir evento?</h2>
          <p>Esta ação não poderá ser desfeita.</p>
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

      <p>
        Deseja realmente excluir
        <strong>${eventoEncontrado.titulo}</strong>?
      </p>

      <div class="acoes-evento">
        <button
          class="botao-controle"
          type="button"
          data-acao="cancelar-exclusao"
          data-evento-id="${eventoEncontrado.id}"
        >
          Cancelar
        </button>

        <button
          class="botao-controle botao-excluir"
          type="button"
          data-acao="confirmar-exclusao"
          data-evento-id="${eventoEncontrado.id}"
        >
          Excluir
        </button>
      </div>
    </div>
  `;
}

function excluirEvento(eventoId) {
  const indiceEvento = eventos.findIndex((evento) => evento.id === eventoId);

  if (indiceEvento === -1) {
    return;
  }

  eventos.splice(indiceEvento, 1);
  salvarEventosNoNavegador();

  const botaoEvento = calendario.querySelector(
    `[data-evento-id="${eventoId}"]`,
  );

  botaoEvento?.remove();

  fecharPainel();
}
function abrirFormularioEdicao(eventoId) {
  const evento = eventos.find((item) => item.id === eventoId);

  if (!evento) {
    return;
  }

  eventoEditando = evento.id;
  dataSelecionada = evento.data;

  abrirFormularioNovoEvento(Number(evento.data.slice(-2)));

  document.querySelector("#titulo-evento").value = evento.titulo;

  document.querySelector("#local-evento").value = evento.local ?? "";

  document.querySelector("#descricao-evento").value = evento.descricao;

  document.querySelector("#status-evento").value = evento.status;
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
    eventoExistente.local = formulario.local.value.trim();
    eventoExistente.descricao = formulario.descricao.value.trim();
    eventoExistente.status = formulario.status.value;
    salvarEventosNoNavegador();

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
    local: formulario.local.value.trim(),
  };

  eventos.push(novoEvento);
  salvarEventosNoNavegador();

  mostrarEventoNoCalendario(novoEvento);
  fecharPainel();
}

function mostrarEventoNoCalendario(evento) {
  const cardDia = calendario.querySelector(`[data-data="${evento.data}"]`);

  if (!cardDia) {
    return;
  }

  const areaEventos = cardDia.querySelector(".eventos-dia");

  const botaoEvento = document.createElement("button");

  botaoEvento.classList.add("resumo-evento", `evento-${evento.status}`);

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

  botaoEvento.className = `resumo-evento evento-${evento.status}`;

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
