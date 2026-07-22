
import trilha1 from './images/trilha1.jpg';
import trilha2 from './images/trilha2.jpg';
import trilha3 from './images/trilha3.jpg';

export function renderCarrossel() {
  return `
    <section class=<main class="layout-pagina pagina-home">
  <section class="carrossel">
    ...
  </section>
</main>>
      <div class="carrossel-container">
        <img
          class="carrossel-imagem ativa"
            src="${trilha1}"
          alt="Grupo realizando trilha"
        >

        <img
          class="carrossel-imagem"
           src="${trilha2}"
          alt="Paisagem de uma trilha"
        >

        <img
          class="carrossel-imagem"
         src="${trilha3}"
          alt="Trilha em meio à natureza"
        >
      </div>

      <button
        class="carrossel-botao anterior"
        type="button"
        aria-label="Imagem anterior"
      >
        &#10094;
      </button>

      <button
        class="carrossel-botao proximo"
        type="button"
        aria-label="Próxima imagem"
      >
        &#10095;
      </button>
    </section>
  `;
}