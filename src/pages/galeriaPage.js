import { renderNavbar } from "../components/navbar/navbar.js";

export function renderGaleria() {
  return `
    ${renderNavbar()}

    <main>
      <h1>HGaleria de fotos</h1>
    </main>
  `;
}