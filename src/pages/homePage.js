import { renderNavbar } from "../components/navbar/navbar.js";
import { renderAtividades } from "../components/home/atividades.js";
import { renderFooter } from "../components/home/footer.js";

export function renderHome() {
  return `
    ${renderNavbar()}

    <main>
      ${renderAtividades()}
    </main>

    ${renderFooter()}
  `;
}