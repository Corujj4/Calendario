
import logo from "../../assets/logo.png";
export function renderNavbar() {
  const rotaAtual = window.location.hash.slice(1) || "/";

  function classeAtiva(rota) {
    return rotaAtual === rota ? "ativo" : "";
  }

 return `
<header class="topo-site">

    <a class="navbar-logo">
        <img
            src="${logo}"
            alt="Ecotrekking"
            class="navbar-logo-imagem"
        >
    </a>

    <nav class="navbar">

        <div class="navbar-conteudo">

            <ul class="navbar-links">

                <li>
                    <a href="#/" class="${classeAtiva("/")}">
                        Início
                    </a>
                </li>

                <li>
                    <a
                        href="#/calendario"
                        class="${classeAtiva("/calendario")}"
                    >
                        Calendário
                    </a>
                </li>

                <li>
                    <a
                        href="#/trilhas"
                        class="${classeAtiva("/trilhas")}"
                    >
                        Trilhas
                    </a>
                </li>

                <li>
                    <a href="#/rapel" 
                        class="${classeAtiva("/rapel")}"
                    >
                        Rapel
                    </a>
                </li>

                <li>
                    <a href="#/expedicoes" 
                        class="${classeAtiva("/expedicoes")}"
                    >
                        Expedições
                    </a>
                </li>

                <li>
                    <a
                        href="#/galeria"
                        class="${classeAtiva("/galeria")}"
                    >
                        Galeria
                    </a>
                </li>

            </ul>

        </div>

    </nav>

</header>
`;
}