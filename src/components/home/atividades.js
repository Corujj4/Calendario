import trilha1 from "../../assets/trilha1.jpg";
import trilha2 from "../../assets/trilha2.jpg";
import trilha3 from "../../assets/trilha3.jpg";

export function renderAtividades() {
  return `
    <section class="secao-atividades">
  <div class="cabecalho-atividades">
    <h2>Nossas Atividades</h2>
    <p>Escolha sua próxima aventura.</p>
  </div>

       <div class="grade-atividades">
        <article class="card-atividade">
          <img
            src="${trilha1}"
            alt="Trilhas"
          >

          <div class="conteudo-card-atividade">
            <h3>🥾 Trilhas</h3>
            <p>Caminhadas guiadas em meio à natureza.</p>
          </div>
        </article>

        <article class="card-atividade">
          <img
            src="${trilha2}"
            alt="Rapel"
          >

          <div class="conteudo-card-atividade">
            <h3>🧗 Rapel</h3>
            <p>Descidas em paredões com total segurança.</p>
          </div>
        </article>

        <article class="card-atividade">
          <img
            src="${trilha3}"
            alt="Expedições"
          >

          <div class="conteudo-card-atividade">
            <h3>🚌 Expedições</h3>
            <p>Viagens e aventuras organizadas pelo grupo.</p>
          </div>
        </article>

      </div>

    </section>
  `;
}