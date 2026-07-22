export function renderCalendarioView() {
  return `
    <main class="layout-pagina pagina-calendario">
      <header class="cabecalho-principal">
        <div class="marca-sistema">
          <div class="marca-icone">🥾</div>

          <div class="marca-linha">
            <h1>Calendário de Trilhas</h1>
            <span>Gestão de eventos e clima</span>
          </div>
        </div>

        <button
          id="botao-atualizar-clima"
          class="botao-controle botao-atualizar-clima"
          type="button"
        >
          Atualizar clima
        </button>
      </header>

      <section
        id="painel-previsao-dia"
        class="painel-previsao-dia"
      ></section>

      <section class="conteudo-principal">
        <section class="area-calendario">
          <div class="cabecalho-calendario">
            <div class="controle-mes-principal">
              <button
                id="botao-mes-anterior"
                class="botao-navegacao"
                type="button"
                aria-label="Mês anterior"
              >
                ←
              </button>

              <h2 id="titulo-mes"></h2>

              <button
                id="botao-proximo-mes"
                class="botao-navegacao"
                type="button"
                aria-label="Próximo mês"
              >
                →
              </button>
            </div>

            <button
              id="botao-hoje"
              class="botao-controle"
              type="button"
            >
              Hoje
            </button>
          </div>

          <div class="dias-semana" aria-hidden="true">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          <section
            id="calendario"
            class="calendario"
            aria-label="Calendário mensal de trilhas"
          ></section>
        </section>

        <aside id="painel-evento" class="painel-evento">
          <div class="painel-vazio">
            <h2>Detalhes da trilha</h2>

            <p>
              Selecione um dia para visualizar ou cadastrar um evento.
            </p>
          </div>
        </aside>
      </section>

      <footer class="rodape-calendario">
        <p id="ultima-atualizacao-clima">
          Clima ainda não atualizado
        </p>
      </footer>
    </main>
  `;
}