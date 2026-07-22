

let botaoHojeRegistrado = null;
let calendario;
let tituloMes;

let botaoMesAnterior;
let botaoProximoMes;
let botaoHoje;

const nomesMeses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const hoje = new Date();

let anoAtual = hoje.getFullYear();
let mesAtual = hoje.getMonth();

function carregarElementos() {
    calendario = document.querySelector("#calendario");
    tituloMes = document.querySelector("#titulo-mes");

    botaoMesAnterior = document.querySelector("#botao-mes-anterior");
    botaoProximoMes = document.querySelector("#botao-proximo-mes");
    botaoHoje = document.querySelector("#botao-hoje");
}


export function criarCalendario() {
  carregarElementos();

  if (!calendario || !tituloMes) {
    console.error("Estrutura do calendário não encontrada.");
    return;
  }

  registrarEventos();

  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();

  const quantidadeDias = new Date(anoAtual, mesAtual + 1, 0).getDate();

  tituloMes.textContent = `${nomesMeses[mesAtual]} de ${anoAtual}`;

  calendario.innerHTML = "";

  for (let i = 0; i < primeiroDiaSemana; i++) {
    const espacoVazio = document.createElement("div");

    espacoVazio.classList.add("card-dia", "dia-vazio");

    calendario.appendChild(espacoVazio);
  }

  for (let dia = 1; dia <= quantidadeDias; dia++) {
    const cardDia = document.createElement("article");

    cardDia.classList.add("card-dia");
    const dataCompleta = new Date(anoAtual, mesAtual, dia);

        const dataFormatada = [
        dataCompleta.getFullYear(),
        String(dataCompleta.getMonth() + 1).padStart(2, "0"),
        String(dataCompleta.getDate()).padStart(2, "0"),
        ].join("-");

        cardDia.dataset.dia = dia;
        cardDia.dataset.data = dataFormatada;

    const ehHoje =
      dia === hoje.getDate() &&
      mesAtual === hoje.getMonth() &&
      anoAtual === hoje.getFullYear();

    if (ehHoje) {
      cardDia.classList.add("dia-atual");
    }

    cardDia.innerHTML = `
      <header class="cabecalho-dia">
        <span class="numero-dia">${dia}</span>

      </header>

      <section class="clima-dia">
        <span>Clima indisponível</span>
      </section>

      <div class="eventos-dia"></div>
    `;

    calendario.appendChild(cardDia);
  }

  
  document.dispatchEvent(new Event("calendarioRenderizado"));

}

function registrarEventos() {
  if (!botaoMesAnterior || !botaoProximoMes || !botaoHoje) {
    return;
  }

  if (botaoHojeRegistrado === botaoHoje) {
    return;
  }

  botaoHojeRegistrado = botaoHoje;

  botaoMesAnterior.addEventListener("click", () => {
        mesAtual--;

  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }

  criarCalendario();
    });

    botaoProximoMes.addEventListener("click", () => {
         mesAtual++;

  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }

  criarCalendario();
    });

    botaoHoje.addEventListener("click", () => {
        anoAtual = hoje.getFullYear();
  mesAtual = hoje.getMonth();

  criarCalendario();
    });
}
