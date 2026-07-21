import { buscarPrevisaoCombinada } from "./climaService.js";
import { obterVisualClima } from "../utils/weatherUtils.js";

let previsoesAtuais = [];
let botaoAtualizarClima = null;
let ultimaAtualizacao = null;
let botaoConfigurado = null;
let eventoCalendarioConfigurado = false;
let atualizacaoEmAndamento = null;

export function obterPrevisaoPorData(data) {
  return previsoesAtuais.find((previsao) => previsao.data === data);
}

export function configurarClima() {
  botaoAtualizarClima = document.querySelector("#botao-atualizar-clima");
  ultimaAtualizacao = document.querySelector("#ultima-atualizacao-clima");

  if (!botaoAtualizarClima || !ultimaAtualizacao) {
    console.error("Elementos do clima não encontrados.");
    return;
  }

  if (botaoConfigurado !== botaoAtualizarClima) {
    botaoAtualizarClima.addEventListener("click", atualizarClima);
    botaoConfigurado = botaoAtualizarClima;
  }

  if (!eventoCalendarioConfigurado) {
    document.addEventListener("calendarioRenderizado", () => {
      if (previsoesAtuais.length > 0) {
        mostrarPrevisoesNoCalendario(previsoesAtuais);
        return;
      }

      atualizarClima();
    });

    eventoCalendarioConfigurado = true;
  }
}

async function atualizarClima() {
  if (atualizacaoEmAndamento) {
    return atualizacaoEmAndamento;
  }

  botaoAtualizarClima = document.querySelector("#botao-atualizar-clima");
  ultimaAtualizacao = document.querySelector("#ultima-atualizacao-clima");

  if (!botaoAtualizarClima || !ultimaAtualizacao) {
    return;
  }

  atualizacaoEmAndamento = (async () => {
    try {
      botaoAtualizarClima.disabled = true;
      botaoAtualizarClima.textContent = "Atualizando...";

      const previsoes = await buscarPrevisaoCombinada(-29.6842, -53.8069);
      previsoesAtuais = previsoes;

      mostrarPrevisoesNoCalendario(previsoes);

      ultimaAtualizacao.textContent =
        `Clima atualizado em ${new Date().toLocaleString("pt-BR")}`;
    } catch (erro) {
      console.error(erro);
      ultimaAtualizacao.textContent = "Não foi possível atualizar o clima";
    } finally {
      if (botaoAtualizarClima?.isConnected) {
        botaoAtualizarClima.disabled = false;
        botaoAtualizarClima.textContent = "Atualizar clima";
      }

      atualizacaoEmAndamento = null;
    }
  })();

  return atualizacaoEmAndamento;
}

function mostrarPrevisoesNoCalendario(previsoes) {
  previsoes.forEach((previsao) => {
    const cardDia = document.querySelector(`[data-data="${previsao.data}"]`);

    if (!cardDia) {
      return;
    }

    const climaDia = cardDia.querySelector(".clima-dia");

    if (!climaDia) {
      return;
    }

    const visual = obterVisualClima(previsao.codigoClima);

    climaDia.className = `clima-dia ${visual.classe}`;
    climaDia.innerHTML = `
      <div class="linha-clima">
        <div class="icone-clima" title="${visual.descricao}">
          ${visual.icone}
        </div>

        <strong>
          ${previsao.temperaturaMinima}° /
          ${previsao.temperaturaMaxima}°
        </strong>
      </div>

      <span class="chance-chuva">
        🌧 ${previsao.chanceChuva}%
      </span>
    `;
  });
}
