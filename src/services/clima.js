import {
  buscarPrevisao16Dias,
} from "./climaService.js";
import { obterVisualClima } from "../utils/weatherUtils.js";

const botaoAtualizarClima = document.querySelector(
  "#botao-atualizar-clima",
);

const ultimaAtualizacao = document.querySelector(
  "#ultima-atualizacao-clima",
);

export function configurarClima() {
  botaoAtualizarClima.addEventListener(
    "click",
    atualizarClima,
  );
}

async function atualizarClima() {
  try {
    botaoAtualizarClima.disabled = true;
    botaoAtualizarClima.textContent = "Atualizando...";

    const latitudeSantaMaria = -29.6842;
    const longitudeSantaMaria = -53.8069;

    const previsoes = await buscarPrevisao16Dias(
    latitudeSantaMaria,
    longitudeSantaMaria,
    );


    mostrarPrevisoesNoCalendario(previsoes);

    ultimaAtualizacao.textContent =
      `Clima atualizado em ${new Date().toLocaleString("pt-BR")}`;
  } catch (erro) {
    console.error(erro);

    ultimaAtualizacao.textContent =
      "Não foi possível atualizar o clima";
  } finally {
    botaoAtualizarClima.disabled = false;
    botaoAtualizarClima.textContent = "Atualizar clima";
  }
}

function mostrarPrevisoesNoCalendario(previsoes) {
  previsoes.forEach((previsao) => {
    const cardDia = document.querySelector(
      `[data-data="${previsao.data}"]`,
    );

    if (!cardDia) {
      return;
    }

    const climaDia = cardDia.querySelector(".clima-dia");

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