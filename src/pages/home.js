import { renderNavbar } from "../components/navbar/navbar.js";
import { renderCarrossel } from "../components/home/carrossel.js";
import { renderFooter } from "../components/home/footer.js";

export function renderHome() {
  return `
    ${renderNavbar()}

    <main>
      ${renderCarrossel()}
    </main>

    ${renderFooter()}
  `;
}