import { obterPrevisaoPorData } from "../services/clima.js";
import { carregarEventos, salvarEventos } from "../services/storageService.js";
import { atualizarPainelPrevisao }
from "../components/calendario/painelPrevisao.js";

let painelEvento = null;
let calendario = null;
let painelConfigurado = null;
let calendarioConfigurado = null;
let eventoCalendarioConfigurado = false;

const eventos = carregarEventos();

let dataSelecionada = null;
let eventoEditando = null;

export function configurarEventos() {
  painelEvento = document.querySelector("#painel-evento");
  calendario = document.querySelector("#calendario");

  if (!painelEvento || !calendario) {
    console.error("Elementos dos eventos não encontrados.");
    return;
  }

  if (painelConfigurado !== painelEvento) {
    painelEvento.addEventListener("input", formatarCampoHorario);
    painelEvento.addEventListener("click", tratarCliquePainel);
    painelEvento.addEventListener("submit", salvarEvento);
    painelConfigurado = painelEvento;
  }

  if (calendarioConfigurado !== calendario) {
    calendario.addEventListener("click", tratarCliqueCalendario);
    calendarioConfigurado = calendario;
  }

  if (!eventoCalendarioConfigurado) {
    document.addEventListener("calendarioRenderizado", mostrarTodosEventos);
    eventoCalendarioConfigurado = true;
  }
}
function formatarCampoHorario(eventoInput) {
  const campo = eventoInput.target;

  const campoHorario =
    campo.name === "horarioInicio" ||
    campo.name === "horarioFim";

  if (!campoHorario) {
    return;
  }

  const numeros = campo.value
    .replace(/\D/g, "")
    .slice(0, 4);

  if (numeros.length <= 2) {
    campo.value = numeros;
    return;
  }

  campo.value =
    `${numeros.slice(0, 2)}:${numeros.slice(2)}`;
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
  if (dataSelecionada) {
    const cardDia = calendario.querySelector(
      `[data-data="${dataSelecionada}"]`,
    );

    if (cardDia) {
      abrirDetalhesDia(cardDia);
      return;
    }
  }

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
      <div class="grupo-campos-evento">
      <div>
  <label for="numero-trilha">Número da trilha</label>

  <div class="campo-ordinal">
    <input
      id="numero-trilha"
      name="numeroTrilha"
      type="number"
      min="1"
      step="1"
      placeholder="Ex.: 12"
    />

    <span>º</span>
  </div>
</div>

  <div>
    <label for="quilometragem-evento">Quilometragem</label>

    <input
      id="quilometragem-evento"
      name="quilometragem"
      type="number"
      min="0"
      step="0.1"
      placeholder="Ex.: 8.5"
    />
  </div>
</div>

<div class="grupo-campos-evento">
  <div>
    <label for="horario-inicio">Início</label>

    <input
  id="horario-inicio"
  name="horarioInicio"
  type="text"
  inputmode="numeric"
  maxlength="5"
  placeholder="00:00"
  pattern="(?:[01][0-9]|2[0-3]):[0-5][0-9]"
  title="Digite um horário válido, por exemplo 07:30"
/>
  </div>

  <div>
    <label for="horario-fim">Término</label>

   <input
  id="horario-fim"
  name="horarioFim"
  type="text"
  inputmode="numeric"
  maxlength="5"
  placeholder="00:00"
  pattern="(?:[01][0-9]|2[0-3]):[0-5][0-9]"
  title="Digite um horário válido, por exemplo 18:30"
/>
  </div>
</div>

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
          <p>${formatarData(eventoEncontrado.data).dataCompleta}</p>
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

        <div class="grade-detalhes-evento">
  <div class="detalhe-evento destaque-trilha">
    <span class="detalhe-icone">🥾</span>

    <div>
      <small>Trilha</small>
      <strong>
        ${eventoEncontrado.numeroTrilha
          ? `${eventoEncontrado.numeroTrilha}º`
          : "Número não informado"}
      </strong>
    </div>
  </div>

  <div class="detalhe-evento">
    <span class="detalhe-icone">📍</span>

    <div>
      <small>Local</small>
      <strong>
        ${eventoEncontrado.local || "Não informado"}
      </strong>
    </div>
  </div>

  <div class="detalhe-evento">
    <span class="detalhe-icone">📏</span>

    <div>
      <small>Distância</small>
      <strong>
        ${eventoEncontrado.quilometragem
          ? `${eventoEncontrado.quilometragem} km`
          : "Não informada"}
      </strong>
    </div>
  </div>

  <div class="detalhe-evento">
    <span class="detalhe-icone">🕒</span>

    <div>
      <small>Horário</small>
      <strong>
        ${
          eventoEncontrado.horarioInicio &&
          eventoEncontrado.horarioFim
            ? `${eventoEncontrado.horarioInicio} Ás ${eventoEncontrado.horarioFim}`
            : eventoEncontrado.horarioInicio ||
              eventoEncontrado.horarioFim ||
              "Não informado"
        }
      </strong>
    </div>
  </div>
</div>

<div class="descricao-detalhe-evento">
  <small>Descrição</small>

  <p>
    ${eventoEncontrado.descricao || "Sem descrição"}
  </p>
</div>

<div class="detalhe-evento status-${eventoEncontrado.status}">
  <span class="status-bolinha"></span>

  <strong>
    ${formatarStatus(eventoEncontrado.status)}
  </strong>
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

function abrirDetalhesDia(cardDia) {
  calendario
  .querySelector(".dia-selecionado")
  ?.classList.remove("dia-selecionado");

cardDia.classList.add("dia-selecionado");
  const data = cardDia.dataset.data;
  dataSelecionada = data;
  atualizarPainelPrevisao(data);
  requestAnimationFrame(() => {
  document
    .querySelector("#painel-previsao-dia")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
});

  const eventosDoDia = eventos.filter((evento) => evento.data === data);

  const previsao = obterPrevisaoPorData(data);

const iconeClima =
  cardDia.querySelector(".icone-clima")?.innerHTML ?? "☁️";

const resumoClima = previsao
  ? `
      <div class="resumo-clima">
        <div class="resumo-clima-icone">
          ${iconeClima}
        </div>

        <div class="resumo-clima-dados">
          <strong>
            ${previsao.temperaturaMinima}° /
            ${previsao.temperaturaMaxima}°
          </strong>

          <span>
            🌧 ${previsao.chanceChuva}% de chuva
          </span>
        </div>
      </div>
    `
  : `
      <p class="clima-indisponivel-painel">
        Clima indisponível
      </p>
    `;

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
 
  painelEvento.innerHTML = `
    <div class="detalhes-dia">
            <div class="cabecalho-painel">
          <div class="data-painel">
          <span>${dataFormatada.diaSemana}</span>
          <h2>${dataFormatada.dataCompleta}</h2>
        </div>

        
        </div>

      <div class="resumo-clima-painel">
  ${resumoClima}
</div>

<button
  class="botao-controle botao-destaque"
  type="button"
  data-acao="novo-evento"
  data-data="${data}"
>
  + Novo evento
</button>

<section class="eventos-painel">

  <h3>Eventos</h3>

  <div class="lista-eventos-painel">
    ${listaEventos}
  </div>

</section>
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

  const dataCompleta = dataLocal.toLocaleDateString(
  "pt-BR",
  {
    day: "numeric",
    month: "long",
  },
);

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

  document.querySelector("#numero-trilha").value =
  evento.numeroTrilha ?? "";

  document.querySelector("#quilometragem-evento").value =
  evento.quilometragem ?? "";

  document.querySelector("#horario-inicio").value =
  evento.horarioInicio ?? "";

  document.querySelector("#horario-fim").value =
  evento.horarioFim ?? "";    
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
    eventoExistente.numeroTrilha =
    formulario.numeroTrilha.value.trim();

    eventoExistente.quilometragem =
    formulario.quilometragem.value.trim();

    eventoExistente.horarioInicio =
    formulario.horarioInicio.value;

    eventoExistente.horarioFim =
    formulario.horarioFim.value;
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
    numeroTrilha: formulario.numeroTrilha.value.trim(),
    quilometragem: formulario.quilometragem.value.trim(),
    horarioInicio: formulario.horarioInicio.value,
    horarioFim: formulario.horarioFim.value,
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
