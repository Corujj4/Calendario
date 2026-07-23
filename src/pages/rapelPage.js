import {
  renderRapelView,
  iniciarRapel
} from "../components/atividades/rapelView.js";

import { renderNavbar } from "../components/navbar/navbar.js";

export function renderRapel() {
  return `
    ${renderNavbar()}
    ${renderRapelView()}
  `;
}

export function iniciarPaginaRapel() {
  iniciarRapel();
}