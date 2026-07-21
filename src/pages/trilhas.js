import { renderNavbar } from "../components/navbar/navbar.js";

export function renderTrilhas() {
  return `
    ${renderNavbar()}

    <main>
      <h1>Trilhas</h1>
    </main>
  `;
}